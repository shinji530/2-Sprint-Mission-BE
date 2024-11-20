import articleRepository from "../repositories/articleRepository";

async function get({ page, pageSize, orderBy, keyword }) {
    const skip = page * pageSize;
    const take = pageSize;
    const sort = orderBy === 'favorite' ? { favoriteCnt: 'desc' } : { createdAt: 'desc' };

    const filter = {
        OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
        ],
    };

    const articles = await articleRepository.get({ skip, take, sort, filter });
    const totalCount = await articleRepository.count(filter);

    return { data: articles, totalCount };
}

async function getById(id) {
    return await articleRepository.getById(id);
}

async function create(data) {
    return await articleRepository.save(data);
}

async function update(id, data) {
    return await articleRepository.update(id, data);
}

async function remove(id) {
    return await articleRepository.remove(id);
}

export default { get, getById, create, update, remove };