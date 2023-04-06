// source/utilities/prompt.ts
// The CLI prompts.

import input from '@inquirer/input';
import confirm from '@inquirer/confirm';
import semver from 'semver';
import chalk from 'chalk';

export async function prompts(defaultVersion?: string): Promise<string> {
  const bumpedVersion = semver.inc(defaultVersion || '', 'patch');
  const version = await input({
    default: bumpedVersion || '0.1.0',
    message: 'What version would you like to release?',
    validate: (answer: string) => {
      const isValid = Boolean(semver.valid(answer));
      return isValid || 'You must provide a valid semver version (1.23.4)';
    },
  });

  const proceed = await confirm({
    message: `You sure you want to release version ${chalk.cyan(version)}?`,
    default: true,
  });

  if (proceed) {
    return version;
  }

  throw new Error('Cancelled the release');
}

export async function gitPrompt(remote: string): Promise<{
  auth: string;
  owner: string;
  repo: string;
  baseBranch: string;
  mainBranch: string;
  generateReleaseNotes: boolean;
}> {
  const authDefault = process.env.GITHUB_TOKEN;
  const remoteOwnerName = remote
    .replace('git@github.com:', '')
    .replace('.git', '')
    .split('/');
  const ownerDefault = remoteOwnerName[0] || '';
  const repoDefault = remoteOwnerName[1] || '';
  const baseBranchDefault = 'dev';
  const mainBranchDefault = 'main';

  const auth = await input({
    default: authDefault,
    message: "What's your GitHub access token?",
    validate: (answer: string) =>
      Boolean(answer) || 'https://github.com/settings/tokens/new?scopes=repo',
  });

  const owner = await input({
    default: ownerDefault,
    message: "What's the repo owner?",
  });

  const repo = await input({
    default: repoDefault,
    message: "What's the repo name?",
  });

  const baseBranch = await input({
    default: baseBranchDefault,
    message: "What's the base branch?",
  });

  const mainBranch = await input({
    default: mainBranchDefault,
    message: "What's the main branch?",
  });

  const generateReleaseNotes = await confirm({
    message: 'Do you want to generate release notes?',
  });

  return {
    auth,
    owner,
    repo,
    baseBranch,
    mainBranch,
    generateReleaseNotes,
  };
}
