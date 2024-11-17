import prisma from "../config/prismaClient";

async function get({ skip, take, sort, filter }) {
  return prisma.article.findMany({
    skip,
    take,
    sort,
    where: filter,
  });
}

async function count(filter) {
  return prisma.article.count({
    where: filter,
  });
}

async function getById(id) {
  return prisma.article.findUnique({
    where: { id }
  });
}

async function save(data) {
  return prisma.article.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      images: data.images
    }
  });
}

async function update(id, data) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

async function remove(id) {
  return prisma.article.delete({
    where: { id }
  });
}

export default { get, count, getById, save, update, remove };