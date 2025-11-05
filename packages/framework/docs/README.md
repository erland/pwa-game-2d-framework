# pwa-game-2d-framework — Quickstart

Install from **npmjs**:

```bash
npm i @erlandlindmark/pwa-game-2d-framework
# or
pnpm add @erlandlindmark/pwa-game-2d-framework
```

Or from **GitHub Packages** (requires .npmrc pointing @erland to GPR):

```bash
npm i @erland/pwa-game-2d-framework
```

Minimal usage:

```ts
// npmjs import
import { GameHost, BasePlayScene } from "@erlandlindmark/pwa-game-2d-framework";

// GitHub Packages import
// import { GameHost, BasePlayScene } from "@erland/pwa-game-2d-framework";

class Play extends BasePlayScene {
  protected buildWorld() {
    // TODO
  }
}

GameHost.launch("game", [Play], { backgroundColor: "#000000" });
```

Artifacts:
- `dist/` — ESM/CJS bundles + types
- `docs/` — Markdown API reference (generated)
- `README.md` — Top-level instructions