// source/utilities/prompt.ts
// The CLI prompts.

import input from '@inquirer/input';
import confirm from '@inquirer/confirm';
import semver from 'semver';
import chalk from 'chalk';

export async function prompts(defaultVersion?: string) {
  const version = await input({
    default: defaultVersion || '0.1.0',
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

export async function gitPrompt() {
  const auth = await input({
    default: process.env.GITHUB_TOKEN,
    message: "What's your GitHub access token?",
    validate: (answer: string) =>
      Boolean(answer) || 'https://github.com/settings/tokens/new?scopes=repo',
  });

  return {
    auth,
    // owner,
    // repo,
    // baseBranch,
  };

  // const version = await input({
  //   default: defaultVersion || '0.1.0',
  //   message: 'What version would you like to release?',
  //   validate: (answer: string) => {
  //     const isValid = Boolean(semver.valid(answer));
  //     return isValid || 'You must provide a valid semver version (1.23.4)';
  //   },
  // });

  // const proceed = await confirm({
  //   message: `You sure you want to release version ${chalk.cyan(version)}?`,
  //   default: true,
  // });

  // if (proceed) {
  //   return version;
  // }

  // throw new Error('Cancelled the release');
}
