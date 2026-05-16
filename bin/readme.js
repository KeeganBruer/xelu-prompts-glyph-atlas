import { CELL, LABEL_WIDTH, KEYS_PER_ROW, HEADER_HEIGHT, DIAG_CELL, NUM_CONTROLLERS, NUM_SLOTS } from "./config.js";
import { CLEAN, LABELED, CLN_KB_X, CLN_kbLightVBase, CLN_diagSectionY, LBL_KB_X, LBL_ctrlVBase, LBL_kbVBase, LBL_kbLightVBase, LBL_diagSectionY, DIAG_COLS, DIAG_COL_LABELS, } from "./layout.js";
export function buildReadme() {
    const H = CELL / 2;
    const diagTable = DIAG_COL_LABELS
        .map((label, i) => `| ${i} | ${label} (col ${DIAG_COLS[i] ?? "?"}) |`)
        .join("\n");
    return `\
# Glyph Atlas — Decode Instructions

Two files are produced. Use **glyph_atlas.png** at runtime; open **glyph_atlas_labeled.png** as a visual reference.

| File | Size | Notes |
|------|------|-------|
| glyph_atlas.png | ${CLEAN.width}×${CLEAN.height} | Icons only — no text or chrome |
| glyph_atlas_labeled.png | ${LABELED.width}×${LABELED.height} | Same icons with title, headers, slot labels |

---

## Controller  (glyph_atlas.png)

\`col\` = \`(int)ControllerType\` — range \`[0..${NUM_CONTROLLERS - 1}]\`

| col | Controller |
|-----|------------|
| 0 | Unknown (Xbox fallback) |
| 1 | Generic (Xbox fallback) |
| 2 | Xbox |
| 3 | PlayStation |
| 4 | SteamDeck |
| 5 | Switch |

\`slot\` = input index — range \`[0..${NUM_SLOTS - 1}]\`

| Range | Category |
|-------|----------|
| 0–14 | Button |
| 15–20 | Axis |
| 21+ | Extended |

**UV sample point:**
\`\`\`
u = (col * ${CELL} + ${H}) / ${CLEAN.width}
v = (slot * ${CELL} + ${H}) / ${CLEAN.height}
\`\`\`

---

## Keyboard  (glyph_atlas.png)

\`i\` = SDL_Scancode order

| Range | Keys |
|-------|------|
| 0–25 | A–Z |
| 26–35 | 1–0 |
| 36 | Enter |
| 37 | Esc |
| 38 | Backspace |
| 39 | Tab |
| … | … |

Grid position:
\`\`\`
col = i % ${KEYS_PER_ROW}
row = floor(i / ${KEYS_PER_ROW})
\`\`\`

Dark theme:
\`\`\`
u = (${CLN_KB_X} + col * ${CELL} + ${H}) / ${CLEAN.width}
v = (row * ${CELL} + ${H}) / ${CLEAN.height}
\`\`\`

Light theme:
\`\`\`
u = (${CLN_KB_X} + col * ${CELL} + ${H}) / ${CLEAN.width}
v = (${CLN_kbLightVBase} + row * ${CELL} + ${H}) / ${CLEAN.height}
\`\`\`

---

## Controller Diagrams  (glyph_atlas.png)

256×256 diagrams stacked vertically at x = ${CLN_KB_X}.

| diagIndex | Controller |
|-----------|------------|
${diagTable}

\`\`\`
x = ${CLN_KB_X}
y = ${CLN_diagSectionY} + diagIndex * ${DIAG_CELL}
\`\`\`

---

## glyph_atlas_labeled.png offsets (reference only)

| Section | X offset | Y offset |
|---------|----------|----------|
| Controller icons | \`${LABEL_WIDTH} + col * ${CELL}\` | \`${LBL_ctrlVBase} + slot * ${CELL}\` |
| Keyboard dark | \`${LBL_KB_X} + col * ${CELL}\` | \`${LBL_kbVBase} + row * ${CELL}\` |
| Keyboard light | \`${LBL_KB_X} + col * ${CELL}\` | \`${LBL_kbLightVBase} + row * ${CELL}\` |
| Diagrams | \`x = ${LBL_KB_X}\` | \`${LBL_diagSectionY} + ${HEADER_HEIGHT} + diagIndex * ${HEADER_HEIGHT + DIAG_CELL}\` |
`;
}
//# sourceMappingURL=readme.js.map