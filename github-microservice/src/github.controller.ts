// github-microservice/src/github/github.controller.ts
import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common';
import { GitHubService } from './github.service';
import { getRepositoryDto, getTopRepositoriesDto } from './dto/github.dto';
import { Response } from 'express';

@Controller('github')
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  // GET /github/top-repositories
  @Get('top-repositories')
  async getTopRepositories(
    @Query(new ValidationPipe()) query: getTopRepositoriesDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { httpStatus, message, data, page } =
      await this.githubService.getTopRepositories({
        page: Number(query.page),
        repoName: query.repoName,
      });

    return res.status(httpStatus).json({ page, data, message });
  }

  // GET /github/repository
  @Get('repository')
  async gepRepository(
    @Query(new ValidationPipe()) query: getRepositoryDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { httpStatus, message, data } =
      await this.githubService.getRepository(query);

    return res.status(httpStatus).json({ data, message });
  }
}
