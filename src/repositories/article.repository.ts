import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get({ skip, take, sort, filter }) {
    return this.prisma.article.findMany({
      skip,
      take,
      orderBy: sort,
      where: filter,
    });
  }

  async count(filter) {
    return this.prisma.article.count({
      where: filter,
    });
  }

  async getById(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async save(data) {
    return this.prisma.article.create({
      data,
    });
  }

  async update(id: string, data) {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
