# PWA Game 2D Framework

A reusable TypeScript framework for Phaser‑based 2D games with opinionated scene lifecycle, input, and scaling helpers.

## Install

Choose **one** source:

**npmjs (recommended for most users)**

```bash
npm i @erlandlindmark/pwa-game-2d-framework
# or
pnpm add @erlandlindmark/pwa-game-2d-framework
```

**GitHub Packages (if you prefer GPR)**

Add to your **.npmrc** (or user-level ~/.npmrc):

```
@erland:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then install:

```bash
npm i @erland/pwa-game-2d-framework
# or
pnpm add @erland/pwa-game-2d-framework
```

> Note the **different import names** depending on source.

## Usage

```ts
// If you installed from npmjs:
import { GameHost, BasePlayScene } from "@erlandlindmark/pwa-game-2d-framework";

// If you installed from GitHub Packages:
import { GameHost, BasePlayScene } from "@erland/pwa-game-2d-framework";

class Play extends BasePlayScene {
  protected buildWorld() {
    // add sprites, set up input, etc.
  }
}

GameHost.launch("#game", [Play], { backgroundColor: "#000000" });
```

## Docs

- API reference is generated with **TypeDoc** and shipped in the package under `docs/`.
- Quickstart: `packages/framework/docs/README.md`.

## Releasing (maintainers)

- Create a git tag like `v0.2.0` or `framework-v0.2.0` and push it.
- CI will set that version in `packages/framework`, build, generate docs, and publish to:
  - **GitHub Packages** as `@erland/pwa-game-2d-framework`
  - **npmjs** as `@erlandlindmark/pwa-game-2d-framework`

Ensure the repo has a secret `NPM_TOKEN` with publish rights on npmjs.
