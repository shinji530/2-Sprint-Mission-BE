import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct, CreateArticle, PatchArticle, CreateComment, PatchComment } from './struct.js';
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", 'https://panda-market-react.netlify.app'],
};

app.use(cors(corsOptions));
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "StructError" || e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

//////// Product API ////////

app.get("/products", 
  asyncHandler(async (req, res) => {
    const { page = 0, pageSize = 10, order = 'recent', search = '' } = req.query;
    
    const products = await prisma.product.findMany({
      skip: parseInt(page) * parseInt(pageSize),
      take: parseInt(pageSize),
      orderBy: order === 'favorite' ? { favoriteCnt: 'desc' } : { createdAt: 'desc' },
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
    });

    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
    });

    res.send({ data: products, totalCount: totalCount });
  })
);

app.get("/products/:id", 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

app.post("/products", 
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });

    res.status(201).send(product);
  })
);

app.patch("/products/:id", 
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });


    if(product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

app.delete("/products/:id", 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });

    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

//////// Article API ////////

app.get("/articles", asyncHandler(async (req, res) => {
  const { page = 0, pageSize = 10, order = 'recent', search = '' } = req.query;

  const article = await prisma.article.findMany({
    skip: parseInt(page) * parseInt(pageSize),
    take: parseInt(pageSize),
    orderBy: order === 'favorite' ? { favoriteCnt: 'desc' } : { createdAt: 'desc' },
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }
  });

  const totalCount = await prisma.article.count({
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }
  });

  res.send({ data: article, totalCount: totalCount });
}))

app.get("/articles/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
  });
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
}));

app.post("/articles", asyncHandler(async (req, res) => {
  assert(req.body, CreateArticle);
  const article = await prisma.article.create({
    data: req.body,
  });

  res.status(201).send(article);
}));

app.patch("/articles/:id", asyncHandler(async (req, res) => {
  assert(req.body, PatchArticle);
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id },
    data: req.body,
  });

  if(article) {
    res.send(article);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
}));

app.delete("/articles/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.delete({
    where: { id },
  });

  if (article) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
}));

//////// Comment API ////////

app.get("/comments", asyncHandler(async (req, res) => {
  const { cursor } = req.query;

  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: cursor ? 10 : undefined,
    skip: cursor ? 1 : 0,
  });

  res.send(comments);
}));

app.get("/products/:productId/comments", asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { cursor } = req.query;

  const comments = await prisma.comment.findMany({
    where: { productId },
    cursor: cursor ? { id: cursor } : undefined,
    take: 10,
    skip: cursor ? 1 : 0,
  });

  res.send(comments);
}));

app.get("/articles/:articleId/comments", asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { cursor } = req.query;

  const comments = await prisma.comment.findMany({
    where: { articleId },
    cursor: cursor ? { id: cursor } : undefined,
    take: 10,
    skip: cursor ? 1 : 0,
  });

  res.send(comments);
}));

app.post("/comments", asyncHandler(async (req, res) => {
  assert(req.body, CreateComment);
  const { content, productId, articleId } = req.body;

  let comment;
  if (productId) {
    comment = await prisma.comment.create({
      data: {
        content: content,
        productId: productId,
      }
    });
  } else if (articleId) {
    comment = await prisma.comment.create({
      data: {
        content: content,
        articleId: articleId,
      }
    });
  } 

  res.status(201).send(comment);
}));

app.patch("/comments/:id", asyncHandler(async (req, res) => {
  assert(req.body, PatchComment);
  const { id } = req.params;

  const comment = await prisma.comment.update({
    where: { id },
    data: req.body,
  });

  if(comment) {
    res.send(comment);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
}));

app.delete("/comments/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.delete({
    where: { id },
  });

  if (comment) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
}));

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
