import auth from "../middlewares/auth";
import authService from "../services/authService";
import asyncHandler from "../middlewares/asyncHandler";

const RENEW_TOKEN_PATH = "/auth/refresh-token";

export const signUp = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.signUp(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await authService.signIn(email, password);
    const accessToken = authService.createToken(user);
    const refreshToken = authService.createToken(user, "refresh");
    await authService.updateUser(user.id, { refreshToken });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    //   path: RENEW_TOKEN_PATH,
    //   maxAge: 1000 * 60 * 60
    // });
    return res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, image: user.image, nickname: user.nickname, createAt: user.createAt, updateAt: user.updateAt } });
  } catch (error) {
    next({ status: 401, message: '로그인 실패: 이메일 또는 비밀번호를 확인하세요.'});
  }
});

export const refreshToken = asyncHandler(
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const { userId } = req.auth;
      const { accessToken, newRefreshToken } = await authService.refreshToken(
        userId,
        refreshToken
      );
      await authService.updateUser(userId, { refreshToken: newRefreshToken });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/refresh-token"
      });
      return res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);
