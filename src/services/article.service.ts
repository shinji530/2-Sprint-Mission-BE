import { Injectable, NotFoundException } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { ArticleRepository } from '../repositories/article.repository';

export type ArticleResponse = {
  totalCount: number;
  data: Article[];
};

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async get({ page, pageSize, orderBy, keyword }): Promise<ArticleResponse> {
    const skip = page * pageSize;
    const take = pageSize;
    const sort = orderBy === 'favorite' ? { favoriteCnt: 'desc' } : { createdAt: 'desc' };

    const filter = {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ],
    };

    const articles = await this.articleRepository.get({ skip, take, sort, filter });
    const totalCount = await this.articleRepository.count(filter);

    return { data: articles, totalCount };
  }

  async getById(id: string): Promise<Article> {
    const article = this.articleRepository.getById(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async create(data: Prisma.ArticleCreateInput): Promise<Article> {
    return this.articleRepository.save(data);
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    return this.articleRepository.update(id, data);
  }

  async remove(id: string): Promise<Article> {
    return this.articleRepository.remove(id);
  }

  async like(id: string): Promise<Article> {
    const article = await this.getById(id);

    return this.update(id, { likeCount: article.likeCount + 1 });
  }

  async unlike(id: string): Promise<Article> {
    const article = await this.getById(id);

    return this.update(id, { likeCount: article.likeCount - 1 });
  }
}
