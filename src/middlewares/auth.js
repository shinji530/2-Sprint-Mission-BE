import commentRepository from "../repositories/commentRepository";
import productRepository from "../repositories/productRepository";
import articleRepository from "../repositories/articleRepository";
import { expressjwt } from "express-jwt";

function throwUnauthorizedError() {
  const error = new Error("Unauthorized");
  error.status = 401;
  throw error;
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user"
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken
});

async function verifyProductAuth(req, res, next) {
  const { id: productId } = req.params;
  try {
    const product = await productRepository.getById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    if (product.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyArticleAuth(req, res, next) {
  const { id: articleId } = req.params;

  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      const error = new Error("Article not found");
      error.status = 404;
      throw error;
    }

    if (article.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}

async function verifyCommentAuth(req, res, next) {
  const { id: commentId } = req.params;

  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error = new Error("Comment not found");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyProductAuth,
  verifyArticleAuth,
  verifyCommentAuth,
};
