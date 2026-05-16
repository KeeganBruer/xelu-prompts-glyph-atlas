import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Dimensions ────────────────────────────────────────────────────────────────

export const CELL            = 64;
export const LABEL_WIDTH     = 96;     // left label strip in labeled atlas only
export const KB_GAP          = 48;     // gap between controller and keyboard sections
export const KEYS_PER_ROW    = 8;
export const HEADER_HEIGHT   = 24;
export const WATERMARK_H     = 16;
export const TITLE_LINE_H    = 20;
export const DIAG_CELL       = 256;
export const DIAG_GAP        = 48;
export const NUM_CONTROLLERS = 6;
export const NUM_SLOTS       = 44;

// ── Text content ──────────────────────────────────────────────────────────────

export const TITLE_LINES: readonly string[] = [
    "Xelu's Free Controllers & Keyboard Prompts",
    "Co: Those Awesome Guys",
    "Author: Nicolae (Xelu) Berbece",
    "Updated 2021: Paul Paun",
    "Glyphed: KeeganB",
    "License: Creative Commons 0 (CC0)",
];

export const WATERMARK_TEXT =
    "Co: Those Awesome Guys  |  Author: Nicolae (Xelu) Berbece  " +
    "|  Updated 2021: Paul Paun  |  Glyphed: KeeganB  |  License: CC0";

// ── Paths ─────────────────────────────────────────────────────────────────────
// import.meta.url points to the compiled bin/ file; assets/ and out/ are siblings of bin/.

const binDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = path.join(binDir, "..", "assets");

export const DIR = {
    xbox:    path.join(ROOT, "Xbox Series"),
    ps:      path.join(ROOT, "PS5"),
    sd:      path.join(ROOT, "Steam Deck"),
    sw:      path.join(ROOT, "Switch"),
    others:  path.join(ROOT, "Others"),
    kb:      path.join(ROOT, "Keyboard & Mouse", "Dark"),
    kbLight: path.join(ROOT, "Keyboard & Mouse", "Light"),
} as const;

export const OUT_DIR = path.join(binDir, "..", "out");
