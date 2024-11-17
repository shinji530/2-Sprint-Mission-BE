import prisma from "../config/prismaClient";

async function findById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

async function save(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password
    }
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: { id },
    data
  });
}

async function createOrUpdate(provider, providerId, email, nickname) {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, nickname },
    create: { provider, providerId, email, nickname }
  });
}

export default { findById, findByEmail, save, update, createOrUpdate };
