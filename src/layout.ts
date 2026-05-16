import type { Layout } from "./types.js";
import {
    CELL, LABEL_WIDTH, KB_GAP, KEYS_PER_ROW,
    HEADER_HEIGHT, WATERMARK_H, TITLE_LINE_H,
    DIAG_CELL, DIAG_GAP, NUM_CONTROLLERS, NUM_SLOTS, TITLE_LINES,
} from "./config.js";
import { KEYBOARD_ICONS } from "./data/keyboard.js";

// ── Shared derived values ─────────────────────────────────────────────────────

export const kbRows         = Math.ceil(KEYBOARD_ICONS.length / KEYS_PER_ROW);
export const kbSectionWidth = KEYS_PER_ROW * CELL;
export const ctrlSectionW   = NUM_CONTROLLERS * CELL;

export const DIAG_COLS       = [2, 3, 5] as const;
export const DIAG_COL_LABELS = ["Xbox", "PlayStation", "Switch"] as const;

// ── Labeled atlas layout ──────────────────────────────────────────────────────
// Includes left label strip (LABEL_WIDTH), title banner, and section headers.

export const titleBannerH    = 4 + TITLE_LINES.length * TITLE_LINE_H + 8;
export const LBL_KB_X        = LABEL_WIDTH + ctrlSectionW + KB_GAP;
export const LBL_ctrlVBase   = titleBannerH + HEADER_HEIGHT;
export const LBL_kbVBase     = titleBannerH + HEADER_HEIGHT;
export const LBL_kbLightVBase = titleBannerH + 2 * HEADER_HEIGHT + kbRows * CELL;
export const LBL_diagSectionY = titleBannerH + 2 * (HEADER_HEIGHT + kbRows * CELL) + DIAG_GAP;

export const LABELED: Layout = {
    width: LBL_KB_X + kbSectionWidth,
    height: Math.max(
        titleBannerH + HEADER_HEIGHT + NUM_SLOTS * CELL,
        LBL_diagSectionY + HEADER_HEIGHT + DIAG_COLS.length * (HEADER_HEIGHT + DIAG_CELL),
    ) + WATERMARK_H,
    ctrlIconX:  (col)  => LABEL_WIDTH + col * CELL,
    ctrlIconY:  (slot) => LBL_ctrlVBase + slot * CELL,
    kbIconX:    (col)  => LBL_KB_X + col * CELL,
    kbDarkY:    (row)  => LBL_kbVBase + row * CELL,
    kbLightY:   (row)  => LBL_kbLightVBase + row * CELL,
    diagIconX:  LBL_KB_X,
    diagIconY:  (ci)   => LBL_diagSectionY + HEADER_HEIGHT + ci * (HEADER_HEIGHT + DIAG_CELL),
};

// ── Clean atlas layout ────────────────────────────────────────────────────────
// Icons start at (0, 0) — no label strip, no title or header rows.

export const CLN_KB_X         = ctrlSectionW + KB_GAP;
export const CLN_kbLightVBase = kbRows * CELL;
export const CLN_diagSectionY = 2 * kbRows * CELL + DIAG_GAP;

export const CLEAN: Layout = {
    width: CLN_KB_X + kbSectionWidth,
    height: Math.max(
        NUM_SLOTS * CELL,
        CLN_diagSectionY + DIAG_COLS.length * DIAG_CELL,
    ),
    ctrlIconX:  (col)  => col * CELL,
    ctrlIconY:  (slot) => slot * CELL,
    kbIconX:    (col)  => CLN_KB_X + col * CELL,
    kbDarkY:    (row)  => row * CELL,
    kbLightY:   (row)  => CLN_kbLightVBase + row * CELL,
    diagIconX:  CLN_KB_X,
    diagIconY:  (ci)   => CLN_diagSectionY + ci * DIAG_CELL,
};
