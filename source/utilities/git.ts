// source/utilities/git.ts
// The git commands.

import { Octokit } from '@octokit/rest';
import { logger } from './logger.js';
import { gitPrompt } from './prompts.js';

export async function git(version: string) {
  logger.info(`Releasing ${version}`);

  const { auth } = await gitPrompt();
  const owner = 'pyramidium';
  const repo = 'release-now';
  const baseBranch = 'dev';

  const octokit = new Octokit({ auth });
  const baseBranchRef = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });
  logger.log(baseBranchRef);

  // TODO: Checkout release branch
  // const octokit.rest.git.createRef({
  //   owner,
  //   repo,
  //   ref,
  //   sha,
  // });

  // TODO: Bump version
  // TODO: Commit bump
  // TODO: Push bump
  // TODO: Merge branch into main
  // TODO: Tag merge
  // TODO: Push tag
  // TODO: Create release
  // TODO: Merge main into dev

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
