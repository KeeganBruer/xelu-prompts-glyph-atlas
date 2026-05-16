import fs from "node:fs";
import path from "node:path";
import Jimp from "jimp";
import { OUT_DIR, NUM_CONTROLLERS, NUM_SLOTS, KEYS_PER_ROW, DIAG_CELL } from "./config.js";
import { CLEAN, LABELED, kbRows, DIAG_COLS } from "./layout.js";
import { KEYBOARD_ICONS } from "./data/keyboard.js";
import { renderIcons } from "./render/icons.js";
import {
    renderTitleBanner, renderSectionSeparator,
    renderControllerChrome, renderKeyboardChrome,
    renderDiagramsChrome, renderWatermark,
} from "./render/chrome.js";
import { buildReadme } from "./readme.js";

async function main(): Promise<void> {
    const [fontW, fontB, fontSmallW, fontSmallB] = await Promise.all([
        Jimp.loadFont(Jimp.FONT_SANS_16_WHITE),
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK),
        Jimp.loadFont(Jimp.FONT_SANS_8_WHITE),
        Jimp.loadFont(Jimp.FONT_SANS_8_BLACK),
    ]);

    const missing: string[] = [];

    // Clean atlas — icons only, no chrome
    const cleanAtlas = await Jimp.create(CLEAN.width, CLEAN.height, 0x222222ff);
    await renderIcons(cleanAtlas, CLEAN, missing);

    // Labeled atlas — icons + all decorative chrome
    const labeledAtlas = await Jimp.create(LABELED.width, LABELED.height, 0x222222ff);
    await renderIcons(labeledAtlas, LABELED, missing);
    renderTitleBanner(labeledAtlas, fontW, fontB);
    renderSectionSeparator(labeledAtlas);
    renderControllerChrome(labeledAtlas, fontW, fontB);
    renderKeyboardChrome(labeledAtlas, fontW, fontB);
    renderDiagramsChrome(labeledAtlas, fontW, fontB);
    renderWatermark(labeledAtlas, fontSmallW, fontSmallB);

    fs.mkdirSync(OUT_DIR, { recursive: true });
    await cleanAtlas.writeAsync(path.join(OUT_DIR, "glyph_atlas.png"));
    await labeledAtlas.writeAsync(path.join(OUT_DIR, "glyph_atlas_labeled.png"));
    fs.writeFileSync(path.join(OUT_DIR, "README.md"), buildReadme());

    console.log(`Wrote out/glyph_atlas.png         (${CLEAN.width}×${CLEAN.height})`);
    console.log(`Wrote out/glyph_atlas_labeled.png (${LABELED.width}×${LABELED.height})`);
    console.log(`  Controllers: ${NUM_CONTROLLERS} cols × ${NUM_SLOTS} slots`);
    console.log(`  Keyboard:    ${KEYBOARD_ICONS.length} keys in ${kbRows} rows × ${KEYS_PER_ROW} cols`);
    console.log(`  Diagrams:    ${DIAG_COLS.length} controllers at ${DIAG_CELL}px`);
    console.log("Wrote out/README.md");

    if (missing.length > 0) {
        console.warn(`  ${missing.length} missing file(s):`);
        missing.forEach(f => console.warn(`    ${f}`));
    } else {
        console.log("  All source files found.");
    }
}

main().catch((err: unknown) => { console.error(err); process.exit(1); });
