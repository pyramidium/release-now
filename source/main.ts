#!/usr/bin/env node

// source/main.ts
// The CLI for the `release-now` module.

import { exit } from 'node:process';
import manifest from '../package.json';
import { resolve } from './utilities/promise.js';
import {
  checkForUpdates,
  getHelpText,
  parseArguments,
} from './utilities/cli.js';
import { logger } from './utilities/logger.js';
import { release } from './utilities/release.js';

try {
  // Parse the options passed by the user.
  const [parseError, args] = await resolve(parseArguments());
  if (parseError) {
    throw new Error(parseError.message);
  }

  // Check for updates to the package unless the user sets the `NO_UPDATE_CHECK`
  // variable.
  const [updateError] = await resolve(checkForUpdates(manifest));
  if (updateError) {
    const suffix = args['--debug'] ? ':' : ' (use `--debug` to see full error)';
    logger.warn(`Checking for updates failed${suffix}`);

    if (args['--debug']) {
      logger.error(updateError.message);
    }
  }

  // If the `version` argument is passed, print the version text and exit.
  if (args['--version']) {
    logger.log(`${manifest.name}@${manifest.version}`);
    exit(0);
  }

  // If the `help` argument is passed, print the help text and exit.
  if (args['--help']) {
    logger.log(getHelpText());
    exit(0);
  }

  // Handle the release.
  const [releaseError] = await resolve(release(args));
  if (releaseError) {
    throw new Error(releaseError.message);
  }
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    throw error;
  }
}

exit(0);
