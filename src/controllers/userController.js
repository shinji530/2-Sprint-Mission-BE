import userService from "../services/userService";
import asyncHandler from "../middlewares/asyncHandler";

export const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: user.id,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    next(error);
  }
});
