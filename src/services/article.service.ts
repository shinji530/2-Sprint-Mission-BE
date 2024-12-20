import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async get({ page, pageSize, orderBy, keyword }) {
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

  async getById(id: string) {
    return this.articleRepository.getById(id);
  }

  async create(data) {
    return this.articleRepository.save(data);
  }

  async update(id: string, data) {
    return this.articleRepository.update(id, data);
  }

  async remove(id: string) {
    return this.articleRepository.remove(id);
  }
}
