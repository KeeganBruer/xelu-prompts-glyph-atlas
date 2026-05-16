import { TITLE_LINES, WATERMARK_TEXT, LABEL_WIDTH, CELL, HEADER_HEIGHT, WATERMARK_H, TITLE_LINE_H, DIAG_CELL, DIAG_GAP, NUM_CONTROLLERS, NUM_SLOTS, KB_GAP, } from "../config.js";
import { CONTROLLER_LABELS, SLOT_LABELS } from "../data/controllers.js";
import { kbSectionWidth, kbRows, ctrlSectionW, titleBannerH, LBL_KB_X, LBL_ctrlVBase, LBL_diagSectionY, LBL_kbVBase, DIAG_COL_LABELS, LABELED, } from "../layout.js";
import { hRule, vRule, shadowPrint } from "./primitives.js";
export function renderTitleBanner(atlas, fontW, fontB) {
    for (const [i, line] of TITLE_LINES.entries()) {
        shadowPrint(atlas, fontW, fontB, 0, 4 + i * TITLE_LINE_H, line, LABELED.width, TITLE_LINE_H);
    }
    hRule(atlas, 0, LABELED.width, titleBannerH - 4);
}
export function renderSectionSeparator(atlas) {
    const sepX = LABEL_WIDTH + ctrlSectionW + Math.floor(KB_GAP / 2);
    vRule(atlas, sepX, titleBannerH, LBL_diagSectionY);
}
export function renderControllerChrome(atlas, fontW, fontB) {
    const headerY = titleBannerH + Math.floor((HEADER_HEIGHT - 16) / 2);
    for (let col = 0; col < NUM_CONTROLLERS; col++) {
        const label = CONTROLLER_LABELS[col] ?? "?";
        shadowPrint(atlas, fontW, fontB, LABEL_WIDTH + col * CELL, headerY, label, CELL, HEADER_HEIGHT);
    }
    for (const [slot, slotLabel] of SLOT_LABELS.entries()) {
        if (slot >= NUM_SLOTS)
            break;
        const label = `${String(slot).padStart(2, "0")} ${slotLabel}`;
        const y = LBL_ctrlVBase + slot * CELL + Math.floor((CELL - 8) / 2);
        atlas.print(fontB, 5, y + 1, label);
        atlas.print(fontW, 4, y, label);
    }
}
export function renderKeyboardChrome(atlas, fontW, fontB) {
    const darkHeaderY = titleBannerH + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, darkHeaderY, "Keyboard (Dark)", kbSectionWidth, HEADER_HEIGHT);
    const lightHeaderY = LBL_kbVBase + kbRows * CELL + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, lightHeaderY, "Keyboard (Light)", kbSectionWidth, HEADER_HEIGHT);
}
export function renderDiagramsChrome(atlas, fontW, fontB) {
    hRule(atlas, LBL_KB_X, LBL_KB_X + kbSectionWidth, LBL_diagSectionY - Math.floor(DIAG_GAP / 2));
    const hdrY = LBL_diagSectionY + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, hdrY, "Controller Diagrams", kbSectionWidth, HEADER_HEIGHT);
    for (const [ci, diagLabel] of DIAG_COL_LABELS.entries()) {
        const rowY = LBL_diagSectionY + HEADER_HEIGHT + ci * (HEADER_HEIGHT + DIAG_CELL);
        const labelY = rowY + Math.floor((HEADER_HEIGHT - 16) / 2);
        shadowPrint(atlas, fontW, fontB, LBL_KB_X, labelY, diagLabel, DIAG_CELL, HEADER_HEIGHT);
    }
}
export function renderWatermark(atlas, fontSmallW, fontSmallB) {
    const y = LABELED.height - WATERMARK_H + Math.floor((WATERMARK_H - 8) / 2);
    atlas.print(fontSmallB, 5, y + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 4, y, WATERMARK_TEXT);
    atlas.print(fontSmallB, 600, y + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 600, y, WATERMARK_TEXT);
}
//# sourceMappingURL=chrome.js.map