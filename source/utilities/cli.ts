// source/utilities/cli.ts
// CLI-related utility functions.

import { env } from 'node:process';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import parseArgv from 'arg';
import checkForUpdate from 'update-check';
import { resolve } from './promise.js';
import { logger } from './logger.js';
import type { Arguments } from '../types.js';

// The help text for the CLI.
const helpText = chalkTemplate`
  {bold.red release-now} - Generic CLI for creating releases on GitHub

  {bold USAGE}

    {bold $} {red release-now}
    {bold $} {red release-now} minor
    {bold $} {red release-now} --help
    {bold $} {red release-now} --version

    By default, {red release-now} will prompt you to set your desired
    version number.

    You may bump the version number by using either a {bold patch}, {bold minor} 
    or {bold major} version increment.

  {bold OPTIONS}

    -h, --help         Shows this help message

    -v, --version      Displays the current version of {red release-now}

    -d, --debug        Show debugging information
`;

/**
 * Returns the help text.
 *
 * @returns The help text shown when the `--help` option is used.
 */
export const getHelpText = (): string => helpText;

// The options the CLI accepts, and how to parse them.
const options = {
  '--help': Boolean,
  '--version': Boolean,
  '--debug': Boolean,
  // A list of aliases for the above options.
  '-h': '--help',
  '-v': '--version',
  '-d': '--debug',
};

/**
 * Parses the program's `process.argv` and returns the options and arguments.
 *
 * @returns The parsed options and arguments.
 */
export const parseArguments = (): Arguments => parseArgv(options);

/**
 * Checks for updates to this package. If an update is available, it brings it
 * to the user's notice by printing a message to the console.
 */
export const checkForUpdates = async (manifest: object): Promise<void> => {
  // Do not check for updates if the `NO_UPDATE_CHECK` variable is set.
  if (env.NO_UPDATE_CHECK) return;

  // Check for a newer version of the package.
  const [error, update] = await resolve(checkForUpdate(manifest));

  // If there is an error, throw it; and if there is no update, return.
  if (error) throw error;
  if (!update) return;

  // If a newer version is available, tell the user.
  logger.log(
    chalk.bgRed.white(' UPDATE '),
    `The latest version of \`release-now\` is ${update.latest}`,
  );
};
