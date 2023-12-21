import { HttpStatus, Injectable } from '@nestjs/common';
import { getRepositoryDto, getTopRepositoriesDto } from './dto/github.dto';
import {
  ParamsForRepositoriesSearch,
  responseParams,
} from './interfaces/response.interface';
import { getRepoData, getTopRepos } from './utils/githubApi';

@Injectable()
export class GitHubService {
  /**
   * This function get repositories from github API,
   * we control whice repositories return by the given params.
   * @param queryParams getTopRepositoriesDto
   * @returns responseParams
   */
  async getTopRepositories(
    queryParams: getTopRepositoriesDto,
  ): Promise<responseParams> {
    let httpStatus: number;
    let message: string;
    let data = [];
    let page;

    const params: ParamsForRepositoriesSearch = {
      q: queryParams.repoName
        ? `${queryParams.repoName} in:name`
        : 'stars:>50000',
      sort: 'stars',
      order: 'desc',
      per_page: 20,
      page: queryParams.page as number, // page,
    };
    try {
      const response = await getTopRepos(params);
      if (response.status === HttpStatus.OK) {
        data = response.data.items;
        page = queryParams.page;
        httpStatus = HttpStatus.OK;
        message = `Got ${data.length} repositories on page ${queryParams.page}${
          queryParams.repoName
            ? ` and repositories name containing ${queryParams.repoName}.`
            : '.'
        }`;
      } else {
        httpStatus = response.status;
        message = 'Error while getting data from gihub API.';
      }
    } catch (e) {
      const error = e as Error;
      const errorMsg = `Cannot get repositories. Error while running getTopRepositories. ${error.name}: ${error.message}`;
      message = errorMsg;
      httpStatus = HttpStatus.BAD_REQUEST;
    }

    httpStatus >= 400 ? console.error(message) : console.log(message);

    return {
      httpStatus,
      message,
      data,
      page,
    };
  }

  /**
   * This function return one repository data by the id of the repository.
   * @param queryParams getRepositoryDto
   * @returns responseParams
   */
  async getRepository(queryParams: getRepositoryDto): Promise<responseParams> {
    let httpStatus: number;
    let message: string;
    let data = [];

    try {
      const response = await getRepoData(queryParams.id);
      if (response.status === HttpStatus.OK) {
        data = response.data;
        httpStatus = HttpStatus.OK;
        message = `Got ${queryParams.id} repository data`;
      } else {
        httpStatus = response.status;
        message = `Error while getting repository ${queryParams.id} data from gihub API.`;
      }
    } catch (e) {
      const error = e as Error;
      const errorMsg = `Cannot get repository ${queryParams.id}. Error while running getRepository: ${error.name}: ${error.message}`;
      message = errorMsg;
      httpStatus = HttpStatus.BAD_REQUEST;
    }

    httpStatus >= 400 ? console.error(message) : console.log(message);

    return {
      httpStatus,
      message,
      data,
    };
  }
}
