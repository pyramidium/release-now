# Release Now

<div>
  <a aria-label="NPM Package" href="https://www.npmjs.com/package/release-now">
    <img src="https://img.shields.io/npm/v/release-now.svg">
  </a>
  <a aria-label="Build Status" href="https://github.com/pyramidium/release-now/actions/workflows/ci.yaml">
    <img src="https://github.com/pyramidium/release-now/actions/workflows/ci.yaml/badge.svg">
  </a>
</div>

### 🚧 This package is currently under development 🚧

Generic CLI for creating releases on GitHub using ES modules.

## Usage

Create a custom version release:

```
> npx release-now
```

Create a patch release:

```
> npx release-now patch
// Bumping version 0.1.0 > 0.1.1
```

Create a minor release:

```
> npx release-now minor
// Bumping version 0.1.0 > 0.2.0
```

Create a major release:

```
> npx release-now major
// Bumping version 0.1.0 > 1.0.0
```

## Prerequisites

Create an access token using this link:

https://github.com/settings/tokens/new?scopes=repo

You can simply paste the token when prompted by the CLI.

Or you can set the environment variable in your terminal:

```
> export GITHUB_TOKEN=paste-your-token-here
```

Or you can set the environment variable in your ~/.profile:

```
export GITHUB_TOKEN=paste-your-token-here
```

> Note: you will have to restart your terminal for this to take effect

## License

[MIT](LICENSE)
