// source/utilities/git.ts
// The git commands.

import { execa } from 'execa';
import { Octokit } from '@octokit/rest';
import { logger } from './logger.js';
import { replacePackageVersion } from './package.js';
import { gitPrompt } from './prompts.js';

export async function git(version: string): Promise<void> {
  logger.info(`Releasing ${version}`);

  logger.info('Performing: git remote get-url origin');
  const { stdout: remote } = await execa('git', [
    'remote',
    'get-url',
    'origin',
  ]);

  logger.info('Performing: prompts');
  const { auth, owner, repo, baseBranch, mainBranch, generateReleaseNotes } =
    await gitPrompt(remote);

  // Check if there are any changes
  logger.info('Performing: git status');
  const { stdout: status } = await execa('git', ['status']);
  const changesNotStaged = status.includes('Changes not staged for commit');
  if (changesNotStaged) {
    throw new Error('Changes not staged for commit');
  }

  // Get the latest changes on the base branch
  logger.info(`Performing: git checkout ${baseBranch}`);
  await execa('git', ['checkout', baseBranch]);
  logger.info(`Performing: git pull origin ${baseBranch}`);
  await execa('git', ['pull', 'origin', baseBranch]);

  // Bump version
  replacePackageVersion(version);

  // Commit bump
  logger.info('Performing: git add package.json');
  await execa('git', ['add', 'package.json']);
  logger.info(`Performing: git commit -m "Bump version to ${version}"`);
  await execa('git', [
    'commit',
    '-m',
    `Bump version to ${version}`,
    '--no-verify',
  ]);

  // Push bump
  logger.info(`Performing: git push origin ${baseBranch}`);
  await execa('git', ['push', 'origin', baseBranch]);

  // Merge branch into main
  logger.info(`Performing: git checkout ${mainBranch}`);
  await execa('git', ['checkout', mainBranch]);
  logger.info(`Performing: git pull origin ${mainBranch}`);
  await execa('git', ['pull', 'origin', mainBranch]);
  logger.info(`Performing: git merge ${baseBranch}`);
  await execa('git', ['merge', baseBranch]);

  // Tag merge
  logger.info(`Performing: git tag v${version}`);
  await execa('git', ['tag', `v${version}`]);

  // Push tag
  logger.info(`Performing: git push origin ${mainBranch} --tags`);
  await execa('git', ['push', 'origin', mainBranch, '--tags']);

  // Create release
  const octokit = new Octokit({ auth });
  await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: `v${version}`,
    generate_release_notes: generateReleaseNotes,
  });

  // Merge main into dev
  logger.info(`Performing: git checkout ${baseBranch}`);
  await execa('git', ['checkout', baseBranch]);
  logger.info(`Performing: git merge ${mainBranch}`);
  await execa('git', ['merge', mainBranch]);
}
