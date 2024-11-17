import prisma from "../config/prismaClient";

async function get({ skip, take, sort, filter }) {
  return prisma.product.findMany({
    skip,
    take,
    sort,
    where: filter,
  });
}

async function count(filter) {
  return prisma.product.count({
    where: filter,
  });
}

async function getById(id) {
  return prisma.product.findUnique({
    where: { id }
  });
}

async function save(data) {
  return prisma.product.create({
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
  return prisma.product.update({
    where: { id },
    data,
  });
}

async function remove(id) {
  return prisma.product.delete({
    where: { id }
  });
}

export default { get, count, getById, save, update, remove };
