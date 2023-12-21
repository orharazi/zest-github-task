import { Octokit } from '@octokit/rest';
import { ParamsForRepositoriesSearch } from 'src/interfaces/response.interface';

const octokit = new Octokit();

export const getRepoData = async (repoId: string) => {
  try {
    return await octokit.request(`GET /repositories/${repoId}`);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getTopRepos = async (options: ParamsForRepositoriesSearch) => {
  try {
    return await octokit.request(`GET /search/repositories`, options);
  } catch (e) {
    console.error(e);
    return null;
  }
};
