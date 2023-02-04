// source/utilities/release.ts
// The release handler.

import semver from 'semver';
import { git } from './git.js';
import { prompts } from './prompts.js';
import { getPackageVersion } from './package.js';
import type { Arguments } from '../types.js';
import type { ReleaseType } from 'semver';

export async function release(args: Arguments): Promise<void> {
  const argument = args._[0] as ReleaseType;
  const hasBump = ['patch', 'minor', 'major'].includes(argument);

  // Error if too many arguments are passed.
  if (args._.length > 1) {
    throw new Error('More than one argument was passed');
  }

  // Ensure that the user has not passed an unsupported option.
  if (args._.length === 1 && !hasBump) {
    throw new Error(`Unknown argument: ${argument}`);
  }

  const currentVersion = getPackageVersion();

  // Bump the version and release.
  if (hasBump) {
    const newVersion = semver.inc(currentVersion, argument);

    if (!newVersion) {
      throw new Error('Could not bump version');
    }

    await git(newVersion);
  }

  // Prompt the user for the version and release.
  if (!hasBump) {
    const newVersion = await prompts(currentVersion);

    await git(newVersion);
  }

  return Promise.resolve();
}
