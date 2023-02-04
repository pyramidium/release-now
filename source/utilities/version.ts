// source/utilities/version.ts
// Get the package version from current working directory.

import fs from 'node:fs';
import path from 'node:path';

export function version(): string {
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
