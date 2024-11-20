import commentRepository from '../repositories/commentRepository';

async function get({ cursor, take, skip }) {
    const cursor = cursor ? { id: cursor } : undefined;
    const take = cursor ? 10 : undefined;
    const skip = cursor ? 1 : 0;

    return await commentRepository.get({ cursor, take, skip });
}

async function getProductComment({ productId, cursor, take, skip }) {
    const cursor = cursor ? { id: cursor } : undefined;
    const take = 10;
    const skip = cursor ? 1 : 0;

    return await commentRepository.getProductComment({ productId, cursor, take, skip });
}

async function getArticleComment({ articleId, cursor, take, skip }) {
    const cursor = cursor ? { id: cursor } : undefined;
    const take = 10;
    const skip = cursor ? 1 : 0;

    return await commentRepository.getArticleComment({ articleId, cursor, take, skip });
}

async function create({ content, productId, articleId }) {
    let comment;

    if (productId) {
        comment = await commentRepository.create({ content, productId });
    } else if (articleId) {
        comment = await commentRepository.create({ content, articleId });
    }

    return comment;
}

async function update(id, data) {
    return await commentRepository.update(id, data);
}

async function remove(id) {
    return await commentRepository.remove(id);
}

export default { get, getProductComment, getArticleComment, create, update, remove };