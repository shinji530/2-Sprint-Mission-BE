import productRepository from "../repositories/productRepository";

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

    const products = await productRepository.get({ skip, take, sort, filter });
    const totalCount = await productRepository.count(filter);

    return { data: products, totalCount };
}

async function getById(id) {
    return await productRepository.getById(id);
}

async function create(data) {
    return await productRepository.save(data);
}

async function update(id, data) {
    return await productRepository.update(id, data);
}

async function remove(id) {
    return await productRepository.remove(id);
}

export default { get, getById, create, update, remove };