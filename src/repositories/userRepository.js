import prisma from "../config/prismaClient";

export default async function findById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}
