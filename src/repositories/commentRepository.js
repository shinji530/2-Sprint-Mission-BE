import prisma from "../config/prismaClient";

async function get({ cursor, take, skip }) {
    return await prisma.comment.findMany({
        cursor,
        take,
        skip,
    });
}

async function getById(id) {
    return await prisma.comment.findUnique({
        where: { id }
    });
}

async function getProductComment({ productId, cursor, take, skip }) {
    return await prisma.comment.findMany({
        where: { productId },
        cursor,
        take,
        skip,
    });
}

async function getArticleComment({ articleId, cursor, take, skip }) {
    return await prisma.comment.findMany({
        where: { articleId },
        cursor,
        take,
        skip,
    });
}

async function create({ content, productId, articleId }) {
    let comment;

    if (productId) {
        comment = await prisma.comment.create({
            data: {
                content,
                productId,
            }
        });
    } else if (articleId) {
        comment = await prisma.comment.create({
            data: {
                content,
                articleId,
            }
        });
    }

    return comment;
}

async function update(id, data) {
    return await prisma.comment.update({
        where: { id },
        data,
    });
}

async function remove(id) {
    return await prisma.comment.delete({
        where: { id }
    });
}

export default { get, getById, getProductComment, getArticleComment, create, update, remove };