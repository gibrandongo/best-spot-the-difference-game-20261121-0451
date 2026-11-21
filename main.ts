// main.ts — hands the Harbour Lights entry to make.fun.
//
// Copies game/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from the
// kit's vendor/makefun-game.ts. Standard library only, deterministic:
// two runs write byte-identical outputs.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function clearOutputContents(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function main() {
  clearOutputContents(OUTPUT_DIR);
  const shotNames = readdirSync(join(REPO_ROOT, 'screenshots')).filter((n) => !n.startsWith('.'));
  if (shotNames.length < 3 || shotNames.length > 4) {
    throw new Error('main.ts: screenshots/ must hold 3 or 4 images, found ' + shotNames.length);
  }
  cpSync(join(REPO_ROOT, 'game'), join(OUTPUT_DIR, 'game'), { recursive: true });
  cpSync(join(REPO_ROOT, 'screenshots'), join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  if (!existsSync(join(OUTPUT_DIR, 'game', 'index.html'))) {
    throw new Error('main.ts: game/index.html is missing from the repository');
  }
  const dossier = buildDossier(OUTPUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 48 * 1024 * 1024,
    game_path_max_bytes: 1000
  });
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
  console.log('wrote ' + OUTPUT_DIR + '/dossier.json (' + dossier.length + ' bytes)');
}

main();
