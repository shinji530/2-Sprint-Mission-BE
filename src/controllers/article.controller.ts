import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto, PatchArticleDto } from '../dto/article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticleList(
    @Query('page') page: number = 0,
    @Query('pageSize') pageSize: number = 10,
    @Query('orderBy') orderBy: string = 'recent',
    @Query('keyword') keyword: string = '',
  ) {
    return this.articleService.get({ page, pageSize, orderBy, keyword });
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    return this.articleService.getById(id);
  }

  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Patch(':id')
  async patchArticle(
    @Param('id') id: string,
    @Body() patchArticleDto: PatchArticleDto,
  ) {
    return this.articleService.update(id, patchArticleDto);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
