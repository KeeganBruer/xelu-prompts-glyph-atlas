import type { Layout } from "../types.js";
import { CELL, DIAG_CELL, KEYS_PER_ROW } from "../config.js";
import { CONTROLLER_ROWS } from "../data/controllers.js";
import { KEYBOARD_ICONS, KEYBOARD_ICONS_LIGHT } from "../data/keyboard.js";
import { DIAG_COLS } from "../layout.js";
import { blitIcon, type JimpImage } from "./primitives.js";

export async function renderIcons(
    atlas: JimpImage, layout: Layout, missing: string[],
): Promise<void> {
    // Controller grid
    for (const [colStr, slots] of Object.entries(CONTROLLER_ROWS)) {
        const col = parseInt(colStr, 10);
        for (const [slot, srcPath] of slots.entries()) {
            if (!srcPath) continue;
            await blitIcon(atlas, srcPath, layout.ctrlIconX(col), layout.ctrlIconY(slot), CELL, missing);
        }
    }

    // Keyboard — dark theme
    for (const [i, icon] of KEYBOARD_ICONS.entries()) {
        const col = i % KEYS_PER_ROW, row = Math.floor(i / KEYS_PER_ROW);
        await blitIcon(atlas, icon.file, layout.kbIconX(col), layout.kbDarkY(row), CELL, missing);
    }

    // Keyboard — light theme
    for (const [i, icon] of KEYBOARD_ICONS_LIGHT.entries()) {
        const col = i % KEYS_PER_ROW, row = Math.floor(i / KEYS_PER_ROW);
        await blitIcon(atlas, icon.file, layout.kbIconX(col), layout.kbLightY(row), CELL, missing);
    }

    // Controller diagrams (slot 22 = Diagram, rendered at larger size)
    for (const [ci, col] of DIAG_COLS.entries()) {
        const slots   = CONTROLLER_ROWS[col];
        const srcPath = slots[22]; // string | null | undefined
        if (srcPath) await blitIcon(atlas, srcPath, layout.diagIconX, layout.diagIconY(ci), DIAG_CELL, missing);
    }
}
