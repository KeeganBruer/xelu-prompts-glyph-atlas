// pack_glyphs.js — temp script, run once to produce assets/textures/ui/glyphs.png
// Requires: npm install jimp@0.22.12
//
// ── CONTROLLER SECTION (left) ─────────────────────────────────────────────────
//   columns = ControllerType enum value  (x axis, 6 cols)
//     col 0  = Unknown    col 1  = Generic
//     col 2  = Xbox       col 3  = PlayStation
//     col 4  = SteamDeck  col 5  = Switch
//   rows = input slot  (y axis, 44 rows)
//     0-14  GamepadButton  15-20 GamepadAxis
//     21 Dpad  22 Diagram  23 Diagram_Simple
//     24 Xbox:Share
//     25 PS:Mic  26 PS:Opt.Alt  27 PS:Shr.Alt  28 PS:Touch
//     29-40 SteamDeck: L4 L5 R4 R5 L.Track R.Track Gyro Minus Plus Power Square Invent.
//     41-42 Switch: SW.L SW.R
//     43 Disconnected (all)
//
//   UV: u = ((int)ControllerType + 0.5) / 6,  v = (slot + 0.5) / 44
//
// ── KEYBOARD SECTION (right, after gap) ──────────────────────────────────────
//   Decode algorithm text occupies the top-right (ALGO_HEIGHT px).
//   Keyboard grid sits below it.
//   Index i → col = i % KEYS_PER_ROW, row = floor(i / KEYS_PER_ROW)
//   UV: u = (KB_X + col*CELL + CELL/2) / atlasWidth
//       v = (ALGO_HEIGHT + row*CELL + CELL/2) / atlasHeight

const Jimp = require("jimp");
const path = require("path");
const fs   = require("fs");

const ROOT        = path.join(__dirname, "assets");
const OUT_DIR     = path.join(__dirname, "out");
const OUT_PATH    = path.join(OUT_DIR, "glyphs.png");
const README_PATH = path.join(OUT_DIR, "README.md");

const CELL             = 64;
const NUM_CONTROLLERS  = 6;
const NUM_SLOTS        = 44;
const LABEL_WIDTH      = 96;
const TITLE_LINE_H     = 20;   // 16px font + 4px gap
const WATERMARK_HEIGHT = 16;
const HEADER_HEIGHT    = 24;
const KB_GAP           = 48;   // horizontal gap between controller and keyboard sections
const KEYS_PER_ROW     = 8;

const TITLE_LINES = [
    "Xelu's Free Controllers & Keyboard Prompts",
    "Co: Those Awesome Guys",
    "Author: Nicolae (Xelu) Berbece",
    "Updated 2021: Paul Paun",
    "Glyphed: KeeganB",
    "License: Creative Commons 0 (CC0)",
];
const TITLE_HEIGHT     = 4 + TITLE_LINES.length * TITLE_LINE_H;
const TITLE_TOP_HEIGHT = TITLE_HEIGHT + 8;   // top banner height

const WATERMARK_TEXT =
    "Co: Those Awesome Guys  |  Author: Nicolae (Xelu) Berbece  " +
    "|  Updated 2021: Paul Paun  |  Glyphed: KeeganB  |  License: CC0";

const XBOX   = path.join(ROOT, "Xbox Series");
const PS     = path.join(ROOT, "PS5");
const SD     = path.join(ROOT, "Steam Deck");
const SW     = path.join(ROOT, "Switch");
const OTHERS = path.join(ROOT, "Others");
const KB     = path.join(ROOT, "Keyboard & Mouse", "Dark");
const KBL    = path.join(ROOT, "Keyboard & Mouse", "Light");

const p = (dir, file) => path.join(dir, file);
const _ = null;

const DISCONNECTED = p(OTHERS, "Controller_Disconnected.png");

// ── Controller rows ───────────────────────────────────────────────────────────

const XBOX_ROW = [
    p(XBOX, "XboxSeriesX_A.png"),                  // 0  South
    p(XBOX, "XboxSeriesX_B.png"),                  // 1  East
    p(XBOX, "XboxSeriesX_X.png"),                  // 2  West
    p(XBOX, "XboxSeriesX_Y.png"),                  // 3  North
    p(XBOX, "XboxSeriesX_View.png"),               // 4  Back
    p(XBOX, "XboxSeriesX_Menu.png"),               // 5  Guide
    p(XBOX, "XboxSeriesX_Menu.png"),               // 6  Start
    p(XBOX, "XboxSeriesX_Left_Stick_Click.png"),   // 7  LeftStick
    p(XBOX, "XboxSeriesX_Right_Stick_Click.png"),  // 8  RightStick
    p(XBOX, "XboxSeriesX_LB.png"),                 // 9  LeftShoulder
    p(XBOX, "XboxSeriesX_RB.png"),                 // 10 RightShoulder
    p(XBOX, "XboxSeriesX_Dpad_Up.png"),            // 11 DpadUp
    p(XBOX, "XboxSeriesX_Dpad_Down.png"),          // 12 DpadDown
    p(XBOX, "XboxSeriesX_Dpad_Left.png"),          // 13 DpadLeft
    p(XBOX, "XboxSeriesX_Dpad_Right.png"),         // 14 DpadRight
    p(XBOX, "XboxSeriesX_Left_Stick.png"),         // 15 LeftX
    p(XBOX, "XboxSeriesX_Left_Stick.png"),         // 16 LeftY
    p(XBOX, "XboxSeriesX_Right_Stick.png"),        // 17 RightX
    p(XBOX, "XboxSeriesX_Right_Stick.png"),        // 18 RightY
    p(XBOX, "XboxSeriesX_LT.png"),                 // 19 LeftTrigger
    p(XBOX, "XboxSeriesX_RT.png"),                 // 20 RightTrigger
    p(XBOX, "XboxSeriesX_Dpad.png"),               // 21 Dpad whole
    p(XBOX, "XboxSeriesX_Diagram.png"),            // 22 Diagram
    p(XBOX, "XboxSeriesX_Diagram_Simple.png"),     // 23 Diagram_Simple
    p(XBOX, "XboxSeriesX_Share.png"),              // 24 Share
    _, _, _, _,                                    // 25-28 PS5-only
    _, _, _, _, _, _, _, _, _, _, _, _,            // 29-40 SD-only
    _, _,                                          // 41-42 Switch-only
    DISCONNECTED,                                  // 43
];

const ROWS = {
    0: XBOX_ROW,  // Unknown  → Xbox fallback
    1: XBOX_ROW,  // Generic  → Xbox fallback
    2: XBOX_ROW,  // Xbox
    3: [          // PlayStation
        p(PS, "PS5_Cross.png"),                    // 0  South
        p(PS, "PS5_Circle.png"),                   // 1  East
        p(PS, "PS5_Square.png"),                   // 2  West
        p(PS, "PS5_Triangle.png"),                 // 3  North
        p(PS, "PS5_Share.png"),                    // 4  Back
        p(PS, "PS5_Options.png"),                  // 5  Guide
        p(PS, "PS5_Options.png"),                  // 6  Start
        p(PS, "PS5_Left_Stick_Click.png"),         // 7  LeftStick
        p(PS, "PS5_Right_Stick_Click.png"),        // 8  RightStick
        p(PS, "PS5_L1.png"),                       // 9  LeftShoulder
        p(PS, "PS5_R1.png"),                       // 10 RightShoulder
        p(PS, "PS5_Dpad_Up.png"),                  // 11 DpadUp
        p(PS, "PS5_Dpad_Down.png"),                // 12 DpadDown
        p(PS, "PS5_Dpad_Left.png"),                // 13 DpadLeft
        p(PS, "PS5_Dpad_Right.png"),               // 14 DpadRight
        p(PS, "PS5_Left_Stick.png"),               // 15 LeftX
        p(PS, "PS5_Left_Stick.png"),               // 16 LeftY
        p(PS, "PS5_Right_Stick.png"),              // 17 RightX
        p(PS, "PS5_Right_Stick.png"),              // 18 RightY
        p(PS, "PS5_L2.png"),                       // 19 LeftTrigger
        p(PS, "PS5_R2.png"),                       // 20 RightTrigger
        p(PS, "PS5_Dpad.png"),                     // 21 Dpad whole
        p(PS, "PS5_Diagram.png"),                  // 22 Diagram
        p(PS, "PS5_Diagram_Simple.png"),           // 23 Diagram_Simple
        _,                                         // 24 Xbox:Share
        p(PS, "PS5_Microphone.png"),               // 25 Microphone
        p(PS, "PS5_Options_Alt.png"),              // 26 Options_Alt
        p(PS, "PS5_Share_Alt.png"),                // 27 Share_Alt
        p(PS, "PS5_Touch_Pad.png"),                // 28 Touch_Pad
        _, _, _, _, _, _, _, _, _, _, _, _,        // 29-40 SD-only
        _, _,                                      // 41-42 Switch-only
        DISCONNECTED,                              // 43
    ],
    4: [          // SteamDeck
        p(SD, "SteamDeck_A.png"),                  // 0  South
        p(SD, "SteamDeck_B.png"),                  // 1  East
        p(SD, "SteamDeck_X.png"),                  // 2  West
        p(SD, "SteamDeck_Y.png"),                  // 3  North
        p(SD, "SteamDeck_Dots.png"),               // 4  Back
        p(SD, "SteamDeck_Steam.png"),              // 5  Guide
        p(SD, "SteamDeck_Menu.png"),               // 6  Start
        p(SD, "SteamDeck_Left_Stick_Click.png"),   // 7  LeftStick
        p(SD, "SteamDeck_Right_Stick_Click.png"),  // 8  RightStick
        p(SD, "SteamDeck_L1.png"),                 // 9  LeftShoulder
        p(SD, "SteamDeck_R1.png"),                 // 10 RightShoulder
        p(SD, "SteamDeck_Dpad_Up.png"),            // 11 DpadUp
        p(SD, "SteamDeck_Dpad_Down.png"),          // 12 DpadDown
        p(SD, "SteamDeck_Dpad_Left.png"),          // 13 DpadLeft
        p(SD, "SteamDeck_Dpad_Right.png"),         // 14 DpadRight
        p(SD, "SteamDeck_Left_Stick.png"),         // 15 LeftX
        p(SD, "SteamDeck_Left_Stick.png"),         // 16 LeftY
        p(SD, "SteamDeck_Right_Stick.png"),        // 17 RightX
        p(SD, "SteamDeck_Right_Stick.png"),        // 18 RightY
        p(SD, "SteamDeck_L2.png"),                 // 19 LeftTrigger
        p(SD, "SteamDeck_R2.png"),                 // 20 RightTrigger
        p(SD, "SteamDeck_Dpad.png"),               // 21 Dpad whole
        _,                                         // 22 Diagram
        _,                                         // 23 Diagram_Simple
        _,                                         // 24 Xbox:Share
        _, _, _, _,                                // 25-28 PS5-only
        p(SD, "SteamDeck_L4.png"),                 // 29
        p(SD, "SteamDeck_L5.png"),                 // 30
        p(SD, "SteamDeck_R4.png"),                 // 31
        p(SD, "SteamDeck_R5.png"),                 // 32
        p(SD, "SteamDeck_Left_Track.png"),         // 33
        p(SD, "SteamDeck_Right_Track.png"),        // 34
        p(SD, "SteamDeck_Gyro.png"),               // 35
        p(SD, "SteamDeck_Minus.png"),              // 36
        p(SD, "SteamDeck_Plus.png"),               // 37
        p(SD, "SteamDeck_Power.png"),              // 38
        p(SD, "SteamDeck_Square.png"),             // 39
        p(SD, "SteamDeck_Inventory.png"),          // 40
        _, _,                                      // 41-42 Switch-only
        DISCONNECTED,                              // 43
    ],
    5: [          // Switch
        p(SW, "Switch_B.png"),                     // 0  South
        p(SW, "Switch_A.png"),                     // 1  East
        p(SW, "Switch_Y.png"),                     // 2  West
        p(SW, "Switch_X.png"),                     // 3  North
        p(SW, "Switch_Minus.png"),                 // 4  Back
        p(SW, "Switch_Home.png"),                  // 5  Guide
        p(SW, "Switch_Plus.png"),                  // 6  Start
        p(SW, "Switch_Left_Stick_Click.png"),      // 7  LeftStick
        p(SW, "Switch_Right_Stick_Click.png"),     // 8  RightStick
        p(SW, "Switch_LB.png"),                    // 9  LeftShoulder
        p(SW, "Switch_RB.png"),                    // 10 RightShoulder
        p(SW, "Switch_Dpad_Up.png"),               // 11 DpadUp
        p(SW, "Switch_Dpad_Down.png"),             // 12 DpadDown
        p(SW, "Switch_Dpad_Left.png"),             // 13 DpadLeft
        p(SW, "Switch_Dpad_Right.png"),            // 14 DpadRight
        p(SW, "Switch_Left_Stick.png"),            // 15 LeftX
        p(SW, "Switch_Left_Stick.png"),            // 16 LeftY
        p(SW, "Switch_Right_Stick.png"),           // 17 RightX
        p(SW, "Switch_Right_Stick.png"),           // 18 RightY
        p(SW, "Switch_LT.png"),                    // 19 LeftTrigger (ZL)
        p(SW, "Switch_RT.png"),                    // 20 RightTrigger (ZR)
        p(SW, "Switch_Dpad.png"),                  // 21 Dpad whole
        p(SW, "Switch_Controllers.png"),           // 22 Diagram
        p(SW, "Switch_Square.png"),                // 23 Diagram_Simple
        _,                                         // 24 Xbox:Share
        _, _, _, _,                                // 25-28 PS5-only
        _, _, _, _, _, _, _, _, _, _, _, _,        // 29-40 SD-only
        p(SW, "Switch_Controller_Left.png"),       // 41 SW.L
        p(SW, "Switch_Controller_Right.png"),      // 42 SW.R
        DISCONNECTED,                              // 43
    ],
};

const SLOT_LABELS = [
    "South","East","West","North","Back","Guide","Start",
    "L.Stick","R.Stick","L.Shldr","R.Shldr",
    "D.Up","D.Down","D.Left","D.Right",
    "L.X","L.Y","R.X","R.Y","L.Trig","R.Trig",
    "Dpad","Diagram","Diag.Sm",
    "Share",
    "Mic","Opt.Alt","Shr.Alt","Touch",
    "L4","L5","R4","R5","L.Track","R.Track",
    "Gyro","Minus","Plus","Power","Square","Invent.",
    "SW.L","SW.R",
    "Discon",
];

const CONTROLLER_LABELS = ["??", "GN", "XB", "PS", "SD", "SW"];

// ── Keyboard icons ────────────────────────────────────────────────────────────
// Ordered by SDL_Scancode (scancodes 4-29 = A-Z, 30-39 = 1-0, then specials).
// Index i maps to grid position (i % KEYS_PER_ROW, floor(i / KEYS_PER_ROW)).

const k = (file, label) => ({ file: p(KB, file), label });

const KEYBOARD_ICONS = [
    // SDL_SCANCODE_A–Z (4–29)
    k("A_Key_Dark.png", "A"),  k("B_Key_Dark.png", "B"),  k("C_Key_Dark.png", "C"),
    k("D_Key_Dark.png", "D"),  k("E_Key_Dark.png", "E"),  k("F_Key_Dark.png", "F"),
    k("G_Key_Dark.png", "G"),  k("H_Key_Dark.png", "H"),  k("I_Key_Dark.png", "I"),
    k("J_Key_Dark.png", "J"),  k("K_Key_Dark.png", "K"),  k("L_Key_Dark.png", "L"),
    k("M_Key_Dark.png", "M"),  k("N_Key_Dark.png", "N"),  k("O_Key_Dark.png", "O"),
    k("P_Key_Dark.png", "P"),  k("Q_Key_Dark.png", "Q"),  k("R_Key_Dark.png", "R"),
    k("S_Key_Dark.png", "S"),  k("T_Key_Dark.png", "T"),  k("U_Key_Dark.png", "U"),
    k("V_Key_Dark.png", "V"),  k("W_Key_Dark.png", "W"),  k("X_Key_Dark.png", "X"),
    k("Y_Key_Dark.png", "Y"),  k("Z_Key_Dark.png", "Z"),
    // SDL_SCANCODE_1–0 (30–39)
    k("1_Key_Dark.png", "1"),  k("2_Key_Dark.png", "2"),  k("3_Key_Dark.png", "3"),
    k("4_Key_Dark.png", "4"),  k("5_Key_Dark.png", "5"),  k("6_Key_Dark.png", "6"),
    k("7_Key_Dark.png", "7"),  k("8_Key_Dark.png", "8"),  k("9_Key_Dark.png", "9"),
    k("0_Key_Dark.png", "0"),
    // SDL_SCANCODE_RETURN(40) ESCAPE(41) BACKSPACE(42) TAB(43) SPACE(44)
    k("Enter_Key_Dark.png",     "Enter"),
    k("Esc_Key_Dark.png",       "Esc"),
    k("Backspace_Key_Dark.png", "Bksp"),
    k("Tab_Key_Dark.png",       "Tab"),
    k("Space_Key_Dark.png",     "Space"),
    // SDL_SCANCODE_MINUS(45) EQUALS(46) LEFTBRACKET(47) RIGHTBRACKET(48)
    k("Minus_Key_Dark.png",         "-"),
    k("Plus_Key_Dark.png",          "="),
    k("Bracket_Left_Key_Dark.png",  "["),
    k("Bracket_Right_Key_Dark.png", "]"),
    // SDL_SCANCODE_SEMICOLON(51) APOSTROPHE(52) GRAVE(53) SLASH(56)
    k("Semicolon_Key_Dark.png", ";"),
    k("Quote_Key_Dark.png",     "'"),
    k("Tilda_Key_Dark.png",     "`"),
    k("Slash_Key_Dark.png",     "/"),
    // SDL_SCANCODE_CAPSLOCK(57)
    k("Caps_Lock_Key_Dark.png", "Caps"),
    // SDL_SCANCODE_F1–F12 (58–69)
    k("F1_Key_Dark.png",  "F1"),  k("F2_Key_Dark.png",  "F2"),  k("F3_Key_Dark.png",  "F3"),
    k("F4_Key_Dark.png",  "F4"),  k("F5_Key_Dark.png",  "F5"),  k("F6_Key_Dark.png",  "F6"),
    k("F7_Key_Dark.png",  "F7"),  k("F8_Key_Dark.png",  "F8"),  k("F9_Key_Dark.png",  "F9"),
    k("F10_Key_Dark.png", "F10"), k("F11_Key_Dark.png", "F11"), k("F12_Key_Dark.png", "F12"),
    // SDL_SCANCODE_PRINTSCREEN(70)
    k("Print_Screen_Key_Dark.png", "PrtSc"),
    // SDL_SCANCODE_NUMLOCKCLEAR(83)
    k("Num_Lock_Key_Dark.png", "NmLk"),
    // SDL_SCANCODE_INSERT(73) HOME(74) PAGEUP(75) DELETE(76) END(77) PAGEDOWN(78)
    k("Insert_Key_Dark.png",    "Ins"),
    k("Home_Key_Dark.png",      "Home"),
    k("Page_Up_Key_Dark.png",   "PgUp"),
    k("Del_Key_Dark.png",       "Del"),
    k("End_Key_Dark.png",       "End"),
    k("Page_Down_Key_Dark.png", "PgDn"),
    // SDL_SCANCODE_RIGHT(79) LEFT(80) DOWN(81) UP(82)
    k("Arrow_Right_Key_Dark.png", "→"),
    k("Arrow_Left_Key_Dark.png",  "←"),
    k("Arrow_Down_Key_Dark.png",  "↓"),
    k("Arrow_Up_Key_Dark.png",    "↑"),
    // Modifiers
    k("Shift_Key_Dark.png",   "Shift"),
    k("Shift_Alt_Key_Dark.png","Shift"),
    k("Ctrl_Key_Dark.png",    "Ctrl"),
    k("Alt_Key_Dark.png",     "Alt"),
    k("Win_Key_Dark.png",     "Win"),
    k("Command_Key_Dark.png", "Cmd"),
    // Alternates / extras
    k("Enter_Alt_Key_Dark.png",    "Enter"),
    k("Enter_Tall_Key_Dark.png",   "Enter"),
    k("Backspace_Alt_Key_Dark.png","Bksp"),
    k("Plus_Tall_Key_Dark.png",    "+"),
    k("Asterisk_Key_Dark.png",     "*"),
    k("Question_Key_Dark.png",     "?"),
    k("Mark_Left_Key_Dark.png",    "<"),
    k("Mark_Right_Key_Dark.png",   ">"),
    // Mouse
    k("Mouse_Left_Key_Dark.png",   "M.L"),
    k("Mouse_Right_Key_Dark.png",  "M.R"),
    k("Mouse_Middle_Key_Dark.png", "M.Mid"),
    k("Mouse_Simple_Key_Dark.png", "Mouse"),
    // Numpad extras (10, 11, 12 — likely numpad symbols)
    k("10_Key_Dark.png", "10"),
    k("11_Key_Dark.png", "11"),
    k("12_Key_Dark.png", "12"),
];

const KEYBOARD_ICONS_LIGHT = KEYBOARD_ICONS.map(({ file, label }) => ({
    file: file.replace(KB, KBL).replace("_Dark.", "_Light."),
    label,
}));

// ── Sanity checks ─────────────────────────────────────────────────────────────

for (const [col, slots] of Object.entries(ROWS)) {
    if (slots.length !== NUM_SLOTS)
        throw new Error(`Controller col ${col} has ${slots.length} slots, expected ${NUM_SLOTS}`);
}
if (SLOT_LABELS.length !== NUM_SLOTS)
    throw new Error(`SLOT_LABELS length ${SLOT_LABELS.length} != ${NUM_SLOTS}`);
if (CONTROLLER_LABELS.length !== NUM_CONTROLLERS)
    throw new Error(`CONTROLLER_LABELS length ${CONTROLLER_LABELS.length} != ${NUM_CONTROLLERS}`);

// ── Layout calculations ───────────────────────────────────────────────────────

const ctrlSectionWidth = NUM_CONTROLLERS * CELL;
const kbCols           = KEYS_PER_ROW;
const kbRows           = Math.ceil(KEYBOARD_ICONS.length / KEYS_PER_ROW);
const kbSectionWidth   = kbCols * CELL;
const KB_X             = LABEL_WIDTH + ctrlSectionWidth + KB_GAP;

const ctrlVBase     = TITLE_TOP_HEIGHT + HEADER_HEIGHT;                          // y where controller row 0 starts
const kbVBase       = TITLE_TOP_HEIGHT + HEADER_HEIGHT;                          // y where dark keyboard row 0 starts
const kbLightVBase  = TITLE_TOP_HEIGHT + 2 * HEADER_HEIGHT + kbRows * CELL;      // y where light keyboard row 0 starts

const leftHeight  = TITLE_TOP_HEIGHT + HEADER_HEIGHT + NUM_SLOTS * CELL;
const rightHeight = TITLE_TOP_HEIGHT + 2 * (HEADER_HEIGHT + kbRows * CELL);
const atlasWidth  = KB_X + kbSectionWidth;

// ── Controller Diagrams section (bottom) ──────────────────────────────────────
const DIAG_CELL        = 256;
const DIAG_GAP         = 48;
const DIAG_COLS        = [2, 3, 5];   // Xbox, PlayStation, Switch
const DIAG_COL_LABELS  = ["Xbox", "PlayStation", "Switch"];
const DIAG_SLOT_LABELS = ["Diagram", "Diag.Sm"];
const diagSectionY     = Math.max(leftHeight, rightHeight) + DIAG_GAP;
const diagSectionH     = 2 * HEADER_HEIGHT + 2 * DIAG_CELL;

const atlasHeight = diagSectionY + diagSectionH + WATERMARK_HEIGHT;

const README_CONTENT = `\
# Glyph Atlas — Decode Instructions

**Atlas size:** W = ${atlasWidth} &nbsp; H = ${atlasHeight}

---

## Controller

\`col\` = \`(int)ControllerType\` — range \`[0..${NUM_CONTROLLERS - 1}]\`

| col | Controller |
|-----|------------|
| 0 | Unknown |
| 1 | Generic |
| 2 | Xbox |
| 3 | PlayStation |
| 4 | SteamDeck |
| 5 | Switch |

\`row\` = \`slotIndex\` — range \`[0..${NUM_SLOTS - 1}]\`

| Range | Category |
|-------|----------|
| 0–14 | Button |
| 15–20 | Axis |
| 21+ | Extended |

**UV sample point:**
\`\`\`
u = (${LABEL_WIDTH} + col * ${CELL} + ${CELL / 2}) / W
v = (${ctrlVBase} + row * ${CELL} + ${CELL / 2}) / H
\`\`\`

---

## Keyboard

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

### Dark Theme
\`\`\`
u = (${KB_X} + col * ${CELL} + ${CELL / 2}) / W
v = (${kbVBase} + row * ${CELL} + ${CELL / 2}) / H
\`\`\`

### Light Theme
\`\`\`
u = (${KB_X} + col * ${CELL} + ${CELL / 2}) / W
v = (${kbLightVBase} + row * ${CELL} + ${CELL / 2}) / H
\`\`\`
`;
// ── Render ────────────────────────────────────────────────────────────────────

async function main() {
    const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const fontBlack = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const fontSmallW = await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE);
    const fontSmallB = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);

    const atlas = await Jimp.create(atlasWidth, atlasHeight, 0x222222ff);
    const missing = [];

    // Title banner centered at the top
    for (let i = 0; i < TITLE_LINES.length; i++) {
        const ty = 4 + i * TITLE_LINE_H;
        atlas.print(fontBlack, 1, ty + 1, { text: TITLE_LINES[i], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, atlasWidth, TITLE_LINE_H);
        atlas.print(fontWhite, 0, ty,     { text: TITLE_LINES[i], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, atlasWidth, TITLE_LINE_H);
    }
    for (let x = 0; x < atlasWidth; x++)
        atlas.setPixelColor(0x444444ff, x, TITLE_TOP_HEIGHT - 4);

    // Vertical separator between left (controller) and right (keyboard) sections
    const sepX = LABEL_WIDTH + ctrlSectionWidth + Math.floor(KB_GAP / 2);
    for (let y = TITLE_TOP_HEIGHT; y < diagSectionY; y++) {
        atlas.setPixelColor(0x444444ff, sepX, y);
    }

    // ── Controller section (left) ────────────────────────────────────────────
    for (const [colStr, slots] of Object.entries(ROWS)) {
        const x = LABEL_WIDTH + parseInt(colStr) * CELL;
        for (let slot = 0; slot < slots.length; slot++) {
            const srcPath = slots[slot];
            if (srcPath === null) continue;
            let icon;
            try { icon = await Jimp.read(srcPath); }
            catch { missing.push(srcPath); continue; }
            icon.resize(CELL, CELL, Jimp.RESIZE_LANCZOS);
            atlas.composite(icon, x, ctrlVBase + slot * CELL);
        }
    }

    // Controller column headers
    const headerY = TITLE_TOP_HEIGHT + Math.floor((HEADER_HEIGHT - 16) / 2);
    for (let col = 0; col < NUM_CONTROLLERS; col++) {
        const hx = LABEL_WIDTH + col * CELL;
        atlas.print(fontBlack, hx + 1, headerY + 1, { text: CONTROLLER_LABELS[col], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, CELL, HEADER_HEIGHT);
        atlas.print(fontWhite, hx,     headerY,     { text: CONTROLLER_LABELS[col], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, CELL, HEADER_HEIGHT);
    }

    // Slot labels in left strip
    for (let slot = 0; slot < NUM_SLOTS; slot++) {
        const label  = `${String(slot).padStart(2, '0')} ${SLOT_LABELS[slot] ?? slot}`;
        const labelY = ctrlVBase + slot * CELL + Math.floor((CELL - 8) / 2);
        atlas.print(fontBlack, 5, labelY + 1, label);
        atlas.print(fontWhite, 4, labelY,     label);
    }

    // ── Right section: keyboard (top) → decoder → title ──────────────────────

    const kbHeaderY = TITLE_TOP_HEIGHT + Math.floor((HEADER_HEIGHT - 16) / 2);

    // "Keyboard (Dark)" header + dark icons
    atlas.print(fontBlack, KB_X + 1, kbHeaderY + 1, { text: "Keyboard (Dark)", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, kbSectionWidth, HEADER_HEIGHT);
    atlas.print(fontWhite, KB_X,     kbHeaderY,     { text: "Keyboard (Dark)", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, kbSectionWidth, HEADER_HEIGHT);

    for (let i = 0; i < KEYBOARD_ICONS.length; i++) {
        const { file } = KEYBOARD_ICONS[i];
        const col = i % KEYS_PER_ROW;
        const row = Math.floor(i / KEYS_PER_ROW);
        const x   = KB_X + col * CELL;
        const y   = kbVBase + row * CELL;

        let icon;
        try { icon = await Jimp.read(file); }
        catch { missing.push(file); continue; }
        icon.resize(CELL, CELL, Jimp.RESIZE_LANCZOS);
        atlas.composite(icon, x, y);
    }

    // "Keyboard (Light)" header + light icons
    const kbLightHeaderTop = TITLE_TOP_HEIGHT + HEADER_HEIGHT + kbRows * CELL;
    atlas.print(fontBlack, KB_X + 1, kbLightHeaderTop + kbHeaderY + 1, { text: "Keyboard (Light)", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, kbSectionWidth, HEADER_HEIGHT);
    atlas.print(fontWhite, KB_X,     kbLightHeaderTop + kbHeaderY,     { text: "Keyboard (Light)", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, kbSectionWidth, HEADER_HEIGHT);

    for (let i = 0; i < KEYBOARD_ICONS_LIGHT.length; i++) {
        const { file } = KEYBOARD_ICONS_LIGHT[i];
        const col = i % KEYS_PER_ROW;
        const row = Math.floor(i / KEYS_PER_ROW);
        const x   = KB_X + col * CELL;
        const y   = kbLightVBase + row * CELL;

        let icon;
        try { icon = await Jimp.read(file); }
        catch { missing.push(file); continue; }
        icon.resize(CELL, CELL, Jimp.RESIZE_LANCZOS);
        atlas.composite(icon, x, y);
    }

    // ── Controller Diagrams section ──────────────────────────────────────────
    for (let x = 0; x < atlasWidth; x++)
        atlas.setPixelColor(0x444444ff, x, diagSectionY - Math.floor(DIAG_GAP / 2));

    const diagHdrY = diagSectionY + Math.floor((HEADER_HEIGHT - 16) / 2);
    atlas.print(fontBlack, LABEL_WIDTH + 1, diagHdrY + 1,
        { text: "Controller Diagrams", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER },
        DIAG_COLS.length * DIAG_CELL, HEADER_HEIGHT);
    atlas.print(fontWhite, LABEL_WIDTH,     diagHdrY,
        { text: "Controller Diagrams", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER },
        DIAG_COLS.length * DIAG_CELL, HEADER_HEIGHT);

    for (let ci = 0; ci < DIAG_COLS.length; ci++) {
        const cx = LABEL_WIDTH + ci * DIAG_CELL;
        const cy = diagSectionY + HEADER_HEIGHT + Math.floor((HEADER_HEIGHT - 16) / 2);
        atlas.print(fontBlack, cx + 1, cy + 1, { text: DIAG_COL_LABELS[ci], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, DIAG_CELL, HEADER_HEIGHT);
        atlas.print(fontWhite, cx,     cy,     { text: DIAG_COL_LABELS[ci], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, DIAG_CELL, HEADER_HEIGHT);
    }

    for (let ri = 0; ri < 1; ri++) {
        const slot    = 22 + ri;   // 22 = Diagram, 23 = Diag.Sm
        const ry      = diagSectionY + 2 * HEADER_HEIGHT + ri * DIAG_CELL;
        const labelY  = ry + Math.floor((DIAG_CELL - 8) / 2);
        atlas.print(fontBlack, 5, labelY + 1, DIAG_SLOT_LABELS[ri]);
        atlas.print(fontWhite, 4, labelY,     DIAG_SLOT_LABELS[ri]);

        for (let ci = 0; ci < DIAG_COLS.length; ci++) {
            const srcPath = ROWS[DIAG_COLS[ci]][slot];
            if (!srcPath) continue;
            const cx = LABEL_WIDTH + ci * DIAG_CELL;
            let icon;
            try { icon = await Jimp.read(srcPath); }
            catch { missing.push(srcPath); continue; }
            icon.resize(DIAG_CELL, DIAG_CELL, Jimp.RESIZE_LANCZOS);
            atlas.composite(icon, cx, ry);
        }
    }

    // Watermark strip at the very bottom (8px font)
    const wmY = atlasHeight - WATERMARK_HEIGHT + Math.floor((WATERMARK_HEIGHT - 8) / 2);
    atlas.print(fontSmallB, 5, wmY + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 4, wmY,     WATERMARK_TEXT);
    atlas.print(fontSmallB, 600, wmY + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 600, wmY,     WATERMARK_TEXT);

    fs.mkdirSync(OUT_DIR, { recursive: true });

    await atlas.writeAsync(OUT_PATH);
    console.log(`Wrote ${OUT_PATH}  (${atlas.getWidth()}x${atlas.getHeight()})`);
    console.log(`  Controller: ${NUM_CONTROLLERS} cols x ${NUM_SLOTS} slots`);
    console.log(`  Keyboard:   ${KEYBOARD_ICONS.length} keys in ${kbRows} rows x ${KEYS_PER_ROW} cols`);
    console.log(`  Diagrams:   ${DIAG_COLS.length} controllers x 2 slots at ${DIAG_CELL}px`);

    fs.writeFileSync(README_PATH, README_CONTENT);
    console.log(`Wrote ${README_PATH}`);
    if (missing.length) {
        console.log(`  ${missing.length} missing file(s):`);
        missing.forEach(m => console.log(`    ${m}`));
    } else {
        console.log("  All source files found.");
    }
}

main().catch(err => { console.error(err); process.exit(1); });
