// source/utilities/package.ts
// Exports package.json related utilities.

import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

export function getPackageVersion(): string {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const currentPackageText = fs.readFileSync(packagePath, 'utf-8');
    const currentPackage = JSON.parse(currentPackageText) as {
      version: string;
    };
    return currentPackage.version;
  } catch {
    throw new Error('Could not find the package version');
  }
}

export function replacePackageVersion(version: string): void {
  const packagePath = path.join(process.cwd(), 'package.json');
  const currentPackageText = fs.readFileSync(packagePath, 'utf-8');
  const currentPackage = JSON.parse(currentPackageText) as {
    version: string;
  };
  const cleanVersion = semver.clean(version);
  if (!cleanVersion) {
    throw new Error('Failed to replace package version');
  }
  currentPackage.version = cleanVersion;
  const stringPackage = JSON.stringify(currentPackage, null, 2);
  return fs.writeFileSync(packagePath, stringPackage);
}
