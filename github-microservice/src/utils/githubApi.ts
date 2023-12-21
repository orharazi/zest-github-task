import { Octokit } from '@octokit/rest';
import { ParamsForRepositoriesSearch } from 'src/interfaces/response.interface';

const octokit = new Octokit({
  auth: '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',
});

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
