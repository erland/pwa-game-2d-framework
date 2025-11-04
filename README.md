# pwa-game-2d-framework (monorepo)

This monorepo contains:
- `packages/framework` — the TypeScript framework that you’ll publish to **GitHub Packages**.
- `packages/templates/basic` — a plain starter template you can `degit`, with a tiny `init.mjs` to wire names and scope.

> **NOTE:** Replace all occurrences of `@SCOPE` with **your GitHub username or org** (e.g. `@erlandlindmark`).  
> GitHub Packages requires the package scope to match the owner that’s publishing.

## Quick start

```bash
# Install pnpm if needed
corepack enable
corepack prepare pnpm@9 --activate

pnpm install

# Build the framework
pnpm build

# (Optional) Publish locally to verify build (dry-run)
cd packages/framework
npm pack
```

## Publishing to GitHub Packages

1. Make sure `packages/framework/package.json` has `"name": "@SCOPE/pwa-game-2d-framework"` and `publishConfig.registry` set to GitHub Packages.
2. In your GitHub repo settings, add permissions for Actions to write packages (default in most orgs).
3. Create a tag matching `framework-v*` (e.g. `framework-v0.1.0`) and push it. The GitHub Action will build and publish.

```bash
git tag framework-v0.1.0
git push origin framework-v0.1.0
```

If you prefer manual publish:

```bash
cd packages/framework
npm publish --registry=https://npm.pkg.github.com
```

> The workflow uses `GITHUB_TOKEN` with `packages: write`. This usually works for GitHub Packages.
> If your org requires it, create a classic PAT with `write:packages` and set it as
> `NPM_TOKEN` repo secret; change the workflow to use `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`.

## Using the template with `degit`

```bash
# Copy the template into a new folder
npx degit YOUR_GH_USER_OR_ORG/pwa-game-2d-framework/packages/templates/basic my-new-game

cd my-new-game

# Wire up your game name, scope, and (optionally) framework version
node scripts/init.mjs --name=my-new-game --scope=YOUR_GH_USER_OR_ORG --framework=latest

pnpm install
pnpm dev
```

The template imports from `@SCOPE/pwa-game-2d-framework` and includes a minimal Phaser setup with
`BootScene`, `MenuScene`, `GameScene`, and `GameOverScene`.
