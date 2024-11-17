import authRepository from "../repositories/authRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { filterSensitiveUserData } from "../utils/filterSensitiveData";

async function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

async function signUp(user) {
  const existedUser = await authRepository.getByEmail(user.email);

  if (existedUser) {
    const error = new Error("이미 사용중인 이메일입니다.");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await authRepository.save({
    ...user,
    password: hashedPassword
  });
  return filterSensitiveUserData(createdUser);
}

async function signIn(email, password) {
  try {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      const error = new Error("해당 이메일이 존재하지 않습니다.");
      error.status = 404;
      throw error;
    }

    verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
  } catch (error) {
    console.error("로그인 오류", error.message);
    throw error;
  }
}

async function getUserById(id) {
  if (!id) {
    const error = new Error("Invalid id");
    error.status = 400;
    throw error;
  }

  const user = await authRepository.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

async function updateUser(id, data) {
  return await authRepository.update(id, data);
}

async function verifyPassword(inputPassword, savedPassword) {
  const isPasswordMatch = await bcrypt.compare(inputPassword, savedPassword);

  if (!isPasswordMatch) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h"
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function refreshToken(userId, refreshToken) {
  const user = await authRepository.findById(userId);

  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { accessToken, newRefreshToken };
}

async function oauthCreateOrUpdate(provider, providerId, email, nickname) {
  const user = await authRepository.createOrUpdate(
    provider,
    providerId,
    email,
    nickname
  );
  return filterSensitiveUserData(user);
}

export default {
  signUp,
  signIn,
  getUserById,
  updateUser,
  createToken,
  refreshToken,
  oauthCreateOrUpdate
};
