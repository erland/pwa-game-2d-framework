// Creates a throwaway app from templates/basic and wires it to the local framework with an absolute link.
// Usage:
//   pnpm run scaffold:local my-demo      # outputs to /tmp/my-demo
//   npm  run scaffold:local -- my-demo
//
// Then:
//   pushd && cd /tmp/my-demo && pnpm install && pnpm dev && popd
//
// Notes:
// - No publishing, no GitHub needed.
// - Uses absolute `link:` to your local framework so edits in packages/framework can be rebuilt and used immediately.

const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const cp = require("child_process");

const REPO_ROOT = process.cwd();
const TEMPLATE = path.resolve(REPO_ROOT, "packages", "templates", "basic");
const OUT = path.resolve("/tmp", process.argv[2] || "basic-dev");
const FRAMEWORK_DIR = path.resolve(REPO_ROOT, "packages", "framework");
const FRAMEWORK_NAME = "@erland/pwa-game-2d-framework"; // from packages/framework/package.json

(async () => {
  if (!fs.existsSync(TEMPLATE)) {
    console.error("Template not found:", TEMPLATE);
    process.exit(1);
  }
  if (!fs.existsSync(FRAMEWORK_DIR)) {
    console.error("Framework dir not found:", FRAMEWORK_DIR);
    process.exit(1);
  }

  // 0) Build framework so its dist/ matches exports
  try {
    console.log("Building framework…");
    cp.execSync("pnpm -C " + JSON.stringify(FRAMEWORK_DIR) + " build", { stdio: "inherit" });
  } catch (e) {
    console.warn("Framework build failed or pnpm missing. Continuing anyway…");
  }

  // 1) Fresh copy of the template
  await fsp.rm(OUT, { recursive: true, force: true });
  await fsp.cp(TEMPLATE, OUT, {
    recursive: true,
    filter: (src) => {
      const rel = src.startsWith(TEMPLATE) ? src.slice(TEMPLATE.length) : src;
      const skip = ["node_modules", "dist", "coverage", ".DS_Store", "pnpm-lock.yaml", "package-lock.json", "yarn.lock"];
      return !skip.some((s) => rel.includes(s));
    },
  });

  // 2) Replace @SCOPE references in source files
  const replaceInFile = async (file) => {
    const txt = await fsp.readFile(file, "utf8");
    const next = txt.replace(/['\"]@SCOPE\/pwa-game-2d-framework['\"]/g, JSON.stringify(FRAMEWORK_NAME));
    if (next !== txt) await fsp.writeFile(file, next);
  };

  const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"]);
  const walk = async (dir) => {
    for (const entry of await fsp.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(p);
      else if (exts.has(path.extname(entry.name))) await replaceInFile(p);
    }
  };
  await walk(OUT);

  // 3) Patch scaffolded package.json dependency
  const pkgPath = path.join(OUT, "package.json");
  const pkg = JSON.parse(await fsp.readFile(pkgPath, "utf8"));
  pkg.name = process.argv[2] || pkg.name || "basic-dev";
  pkg.dependencies = pkg.dependencies || {}

  // Remove any placeholder key and set actual name
  for (const key of Object.keys(pkg.dependencies)) {
    if (key.endsWith("/pwa-game-2d-framework") && key !== FRAMEWORK_NAME) delete pkg.dependencies[key];
  }
  pkg.dependencies[FRAMEWORK_NAME] = "link:" + FRAMEWORK_DIR;

  // Ensure helpful scripts
  pkg.scripts = Object.assign({}, pkg.scripts, { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" });

  await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // 4) Add preserveSymlinks to vite.config.ts if missing
  const vitePath = path.join(OUT, "vite.config.ts");
  if (fs.existsSync(vitePath)) {
    let vtxt = await fsp.readFile(vitePath, "utf8");
    if (!/preserveSymlinks\s*:\s*true/.test(vtxt)) {
      vtxt = vtxt.replace(/defineConfig\(\{/, (m) => m + "\n  resolve: { preserveSymlinks: true },\n");
      await fsp.writeFile(vitePath, vtxt);
    }
  }

  console.log("Scaffolded app at:", OUT);
  console.log(`\nNext steps:\n  pushd && cd ${OUT} && pnpm install &&  pnpm dev && popd`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
