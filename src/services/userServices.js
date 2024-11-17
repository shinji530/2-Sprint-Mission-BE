import userRepository from "../repositories/userRepository";
import { filterSensitiveUserData } from "../utils/filterSensitiveData";

export default async function getUserById(id) {
  if (!id) {
    const error = new Error("Invalid id");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}
