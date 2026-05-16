// pack_glyphs.js — produces out/glyph_atlas.png and out/glyph_atlas_labeled.png
// Requires: npm install jimp@0.22.12
//
// glyph_atlas.png         — icon-only atlas (use this at runtime)
// glyph_atlas_labeled.png — same icons with title, column headers, slot labels, watermark
//
// UV decode instructions in out/README.md

const Jimp = require("jimp");
const path = require("path");
const fs   = require("fs");

// ── Paths ─────────────────────────────────────────────────────────────────────

const ROOT    = path.join(__dirname, "assets");
const OUT_DIR = path.join(__dirname, "out");

const DIR = {
    xbox:    path.join(ROOT, "Xbox Series"),
    ps:      path.join(ROOT, "PS5"),
    sd:      path.join(ROOT, "Steam Deck"),
    sw:      path.join(ROOT, "Switch"),
    others:  path.join(ROOT, "Others"),
    kb:      path.join(ROOT, "Keyboard & Mouse", "Dark"),
    kbLight: path.join(ROOT, "Keyboard & Mouse", "Light"),
};

const p = (dir, file) => path.join(dir, file);
const DISCONNECTED = p(DIR.others, "Controller_Disconnected.png");

// ── Dimensions ────────────────────────────────────────────────────────────────

const CELL            = 64;
const LABEL_WIDTH     = 96;     // left label strip in labeled atlas only
const KB_GAP          = 48;     // horizontal gap between controller and keyboard sections
const KEYS_PER_ROW    = 8;
const HEADER_HEIGHT   = 24;
const WATERMARK_H     = 16;
const TITLE_LINE_H    = 20;
const DIAG_CELL       = 256;
const DIAG_GAP        = 48;
const NUM_CONTROLLERS = 6;
const NUM_SLOTS       = 44;

// ── Text content ──────────────────────────────────────────────────────────────

const TITLE_LINES = [
    "Xelu's Free Controllers & Keyboard Prompts",
    "Co: Those Awesome Guys",
    "Author: Nicolae (Xelu) Berbece",
    "Updated 2021: Paul Paun",
    "Glyphed: KeeganB",
    "License: Creative Commons 0 (CC0)",
];

const WATERMARK_TEXT =
    "Co: Those Awesome Guys  |  Author: Nicolae (Xelu) Berbece  " +
    "|  Updated 2021: Paul Paun  |  Glyphed: KeeganB  |  License: CC0";

// ── Controller data ───────────────────────────────────────────────────────────

const CONTROLLER_LABELS = ["??", "GN", "XB", "PS", "SD", "SW"];

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

const _ = null;

const XBOX_ROW = [
    p(DIR.xbox, "XboxSeriesX_A.png"),                  // 0  South
    p(DIR.xbox, "XboxSeriesX_B.png"),                  // 1  East
    p(DIR.xbox, "XboxSeriesX_X.png"),                  // 2  West
    p(DIR.xbox, "XboxSeriesX_Y.png"),                  // 3  North
    p(DIR.xbox, "XboxSeriesX_View.png"),               // 4  Back
    p(DIR.xbox, "XboxSeriesX_Menu.png"),               // 5  Guide
    p(DIR.xbox, "XboxSeriesX_Menu.png"),               // 6  Start
    p(DIR.xbox, "XboxSeriesX_Left_Stick_Click.png"),   // 7  LeftStick
    p(DIR.xbox, "XboxSeriesX_Right_Stick_Click.png"),  // 8  RightStick
    p(DIR.xbox, "XboxSeriesX_LB.png"),                 // 9  LeftShoulder
    p(DIR.xbox, "XboxSeriesX_RB.png"),                 // 10 RightShoulder
    p(DIR.xbox, "XboxSeriesX_Dpad_Up.png"),            // 11 DpadUp
    p(DIR.xbox, "XboxSeriesX_Dpad_Down.png"),          // 12 DpadDown
    p(DIR.xbox, "XboxSeriesX_Dpad_Left.png"),          // 13 DpadLeft
    p(DIR.xbox, "XboxSeriesX_Dpad_Right.png"),         // 14 DpadRight
    p(DIR.xbox, "XboxSeriesX_Left_Stick.png"),         // 15 LeftX
    p(DIR.xbox, "XboxSeriesX_Left_Stick.png"),         // 16 LeftY
    p(DIR.xbox, "XboxSeriesX_Right_Stick.png"),        // 17 RightX
    p(DIR.xbox, "XboxSeriesX_Right_Stick.png"),        // 18 RightY
    p(DIR.xbox, "XboxSeriesX_LT.png"),                 // 19 LeftTrigger
    p(DIR.xbox, "XboxSeriesX_RT.png"),                 // 20 RightTrigger
    p(DIR.xbox, "XboxSeriesX_Dpad.png"),               // 21 Dpad whole
    p(DIR.xbox, "XboxSeriesX_Diagram.png"),            // 22 Diagram
    p(DIR.xbox, "XboxSeriesX_Diagram_Simple.png"),     // 23 Diagram_Simple
    p(DIR.xbox, "XboxSeriesX_Share.png"),              // 24 Share
    _, _, _, _,                                        // 25-28 PS5-only
    _, _, _, _, _, _, _, _, _, _, _, _,                // 29-40 SD-only
    _, _,                                              // 41-42 Switch-only
    DISCONNECTED,                                      // 43
];

const CONTROLLER_ROWS = {
    0: XBOX_ROW,  // Unknown  → Xbox fallback
    1: XBOX_ROW,  // Generic  → Xbox fallback
    2: XBOX_ROW,  // Xbox
    3: [          // PlayStation
        p(DIR.ps, "PS5_Cross.png"),                    // 0  South
        p(DIR.ps, "PS5_Circle.png"),                   // 1  East
        p(DIR.ps, "PS5_Square.png"),                   // 2  West
        p(DIR.ps, "PS5_Triangle.png"),                 // 3  North
        p(DIR.ps, "PS5_Share.png"),                    // 4  Back
        p(DIR.ps, "PS5_Options.png"),                  // 5  Guide
        p(DIR.ps, "PS5_Options.png"),                  // 6  Start
        p(DIR.ps, "PS5_Left_Stick_Click.png"),         // 7  LeftStick
        p(DIR.ps, "PS5_Right_Stick_Click.png"),        // 8  RightStick
        p(DIR.ps, "PS5_L1.png"),                       // 9  LeftShoulder
        p(DIR.ps, "PS5_R1.png"),                       // 10 RightShoulder
        p(DIR.ps, "PS5_Dpad_Up.png"),                  // 11 DpadUp
        p(DIR.ps, "PS5_Dpad_Down.png"),                // 12 DpadDown
        p(DIR.ps, "PS5_Dpad_Left.png"),                // 13 DpadLeft
        p(DIR.ps, "PS5_Dpad_Right.png"),               // 14 DpadRight
        p(DIR.ps, "PS5_Left_Stick.png"),               // 15 LeftX
        p(DIR.ps, "PS5_Left_Stick.png"),               // 16 LeftY
        p(DIR.ps, "PS5_Right_Stick.png"),              // 17 RightX
        p(DIR.ps, "PS5_Right_Stick.png"),              // 18 RightY
        p(DIR.ps, "PS5_L2.png"),                       // 19 LeftTrigger
        p(DIR.ps, "PS5_R2.png"),                       // 20 RightTrigger
        p(DIR.ps, "PS5_Dpad.png"),                     // 21 Dpad whole
        p(DIR.ps, "PS5_Diagram.png"),                  // 22 Diagram
        p(DIR.ps, "PS5_Diagram_Simple.png"),           // 23 Diagram_Simple
        _,                                             // 24 Xbox:Share
        p(DIR.ps, "PS5_Microphone.png"),               // 25 Microphone
        p(DIR.ps, "PS5_Options_Alt.png"),              // 26 Options_Alt
        p(DIR.ps, "PS5_Share_Alt.png"),                // 27 Share_Alt
        p(DIR.ps, "PS5_Touch_Pad.png"),                // 28 Touch_Pad
        _, _, _, _, _, _, _, _, _, _, _, _,            // 29-40 SD-only
        _, _,                                          // 41-42 Switch-only
        DISCONNECTED,                                  // 43
    ],
    4: [          // SteamDeck
        p(DIR.sd, "SteamDeck_A.png"),                  // 0  South
        p(DIR.sd, "SteamDeck_B.png"),                  // 1  East
        p(DIR.sd, "SteamDeck_X.png"),                  // 2  West
        p(DIR.sd, "SteamDeck_Y.png"),                  // 3  North
        p(DIR.sd, "SteamDeck_Dots.png"),               // 4  Back
        p(DIR.sd, "SteamDeck_Steam.png"),              // 5  Guide
        p(DIR.sd, "SteamDeck_Menu.png"),               // 6  Start
        p(DIR.sd, "SteamDeck_Left_Stick_Click.png"),   // 7  LeftStick
        p(DIR.sd, "SteamDeck_Right_Stick_Click.png"),  // 8  RightStick
        p(DIR.sd, "SteamDeck_L1.png"),                 // 9  LeftShoulder
        p(DIR.sd, "SteamDeck_R1.png"),                 // 10 RightShoulder
        p(DIR.sd, "SteamDeck_Dpad_Up.png"),            // 11 DpadUp
        p(DIR.sd, "SteamDeck_Dpad_Down.png"),          // 12 DpadDown
        p(DIR.sd, "SteamDeck_Dpad_Left.png"),          // 13 DpadLeft
        p(DIR.sd, "SteamDeck_Dpad_Right.png"),         // 14 DpadRight
        p(DIR.sd, "SteamDeck_Left_Stick.png"),         // 15 LeftX
        p(DIR.sd, "SteamDeck_Left_Stick.png"),         // 16 LeftY
        p(DIR.sd, "SteamDeck_Right_Stick.png"),        // 17 RightX
        p(DIR.sd, "SteamDeck_Right_Stick.png"),        // 18 RightY
        p(DIR.sd, "SteamDeck_L2.png"),                 // 19 LeftTrigger
        p(DIR.sd, "SteamDeck_R2.png"),                 // 20 RightTrigger
        p(DIR.sd, "SteamDeck_Dpad.png"),               // 21 Dpad whole
        _,                                             // 22 Diagram
        _,                                             // 23 Diagram_Simple
        _,                                             // 24 Xbox:Share
        _, _, _, _,                                    // 25-28 PS5-only
        p(DIR.sd, "SteamDeck_L4.png"),                 // 29
        p(DIR.sd, "SteamDeck_L5.png"),                 // 30
        p(DIR.sd, "SteamDeck_R4.png"),                 // 31
        p(DIR.sd, "SteamDeck_R5.png"),                 // 32
        p(DIR.sd, "SteamDeck_Left_Track.png"),         // 33
        p(DIR.sd, "SteamDeck_Right_Track.png"),        // 34
        p(DIR.sd, "SteamDeck_Gyro.png"),               // 35
        p(DIR.sd, "SteamDeck_Minus.png"),              // 36
        p(DIR.sd, "SteamDeck_Plus.png"),               // 37
        p(DIR.sd, "SteamDeck_Power.png"),              // 38
        p(DIR.sd, "SteamDeck_Square.png"),             // 39
        p(DIR.sd, "SteamDeck_Inventory.png"),          // 40
        _, _,                                          // 41-42 Switch-only
        DISCONNECTED,                                  // 43
    ],
    5: [          // Switch
        p(DIR.sw, "Switch_B.png"),                     // 0  South
        p(DIR.sw, "Switch_A.png"),                     // 1  East
        p(DIR.sw, "Switch_Y.png"),                     // 2  West
        p(DIR.sw, "Switch_X.png"),                     // 3  North
        p(DIR.sw, "Switch_Minus.png"),                 // 4  Back
        p(DIR.sw, "Switch_Home.png"),                  // 5  Guide
        p(DIR.sw, "Switch_Plus.png"),                  // 6  Start
        p(DIR.sw, "Switch_Left_Stick_Click.png"),      // 7  LeftStick
        p(DIR.sw, "Switch_Right_Stick_Click.png"),     // 8  RightStick
        p(DIR.sw, "Switch_LB.png"),                    // 9  LeftShoulder
        p(DIR.sw, "Switch_RB.png"),                    // 10 RightShoulder
        p(DIR.sw, "Switch_Dpad_Up.png"),               // 11 DpadUp
        p(DIR.sw, "Switch_Dpad_Down.png"),             // 12 DpadDown
        p(DIR.sw, "Switch_Dpad_Left.png"),             // 13 DpadLeft
        p(DIR.sw, "Switch_Dpad_Right.png"),            // 14 DpadRight
        p(DIR.sw, "Switch_Left_Stick.png"),            // 15 LeftX
        p(DIR.sw, "Switch_Left_Stick.png"),            // 16 LeftY
        p(DIR.sw, "Switch_Right_Stick.png"),           // 17 RightX
        p(DIR.sw, "Switch_Right_Stick.png"),           // 18 RightY
        p(DIR.sw, "Switch_LT.png"),                    // 19 LeftTrigger (ZL)
        p(DIR.sw, "Switch_RT.png"),                    // 20 RightTrigger (ZR)
        p(DIR.sw, "Switch_Dpad.png"),                  // 21 Dpad whole
        p(DIR.sw, "Switch_Controllers.png"),           // 22 Diagram
        p(DIR.sw, "Switch_Square.png"),                // 23 Diagram_Simple
        _,                                             // 24 Xbox:Share
        _, _, _, _,                                    // 25-28 PS5-only
        _, _, _, _, _, _, _, _, _, _, _, _,            // 29-40 SD-only
        p(DIR.sw, "Switch_Controller_Left.png"),       // 41 SW.L
        p(DIR.sw, "Switch_Controller_Right.png"),      // 42 SW.R
        DISCONNECTED,                                  // 43
    ],
};

// ── Keyboard data ─────────────────────────────────────────────────────────────

const k = (file, label) => ({ file: p(DIR.kb, file), label });

const KEYBOARD_ICONS = [
    // A–Z (SDL_SCANCODE 4–29)
    k("A_Key_Dark.png", "A"),  k("B_Key_Dark.png", "B"),  k("C_Key_Dark.png", "C"),
    k("D_Key_Dark.png", "D"),  k("E_Key_Dark.png", "E"),  k("F_Key_Dark.png", "F"),
    k("G_Key_Dark.png", "G"),  k("H_Key_Dark.png", "H"),  k("I_Key_Dark.png", "I"),
    k("J_Key_Dark.png", "J"),  k("K_Key_Dark.png", "K"),  k("L_Key_Dark.png", "L"),
    k("M_Key_Dark.png", "M"),  k("N_Key_Dark.png", "N"),  k("O_Key_Dark.png", "O"),
    k("P_Key_Dark.png", "P"),  k("Q_Key_Dark.png", "Q"),  k("R_Key_Dark.png", "R"),
    k("S_Key_Dark.png", "S"),  k("T_Key_Dark.png", "T"),  k("U_Key_Dark.png", "U"),
    k("V_Key_Dark.png", "V"),  k("W_Key_Dark.png", "W"),  k("X_Key_Dark.png", "X"),
    k("Y_Key_Dark.png", "Y"),  k("Z_Key_Dark.png", "Z"),
    // 1–0 (SDL_SCANCODE 30–39)
    k("1_Key_Dark.png", "1"),  k("2_Key_Dark.png", "2"),  k("3_Key_Dark.png", "3"),
    k("4_Key_Dark.png", "4"),  k("5_Key_Dark.png", "5"),  k("6_Key_Dark.png", "6"),
    k("7_Key_Dark.png", "7"),  k("8_Key_Dark.png", "8"),  k("9_Key_Dark.png", "9"),
    k("0_Key_Dark.png", "0"),
    // SDL_SCANCODE 40–44
    k("Enter_Key_Dark.png",     "Enter"),
    k("Esc_Key_Dark.png",       "Esc"),
    k("Backspace_Key_Dark.png", "Bksp"),
    k("Tab_Key_Dark.png",       "Tab"),
    k("Space_Key_Dark.png",     "Space"),
    // SDL_SCANCODE 45–48
    k("Minus_Key_Dark.png",         "-"),
    k("Plus_Key_Dark.png",          "="),
    k("Bracket_Left_Key_Dark.png",  "["),
    k("Bracket_Right_Key_Dark.png", "]"),
    // SDL_SCANCODE 51–53, 56
    k("Semicolon_Key_Dark.png", ";"),
    k("Quote_Key_Dark.png",     "'"),
    k("Tilda_Key_Dark.png",     "`"),
    k("Slash_Key_Dark.png",     "/"),
    // SDL_SCANCODE 57 CapsLock
    k("Caps_Lock_Key_Dark.png", "Caps"),
    // F1–F12 (SDL_SCANCODE 58–69)
    k("F1_Key_Dark.png",  "F1"),  k("F2_Key_Dark.png",  "F2"),  k("F3_Key_Dark.png",  "F3"),
    k("F4_Key_Dark.png",  "F4"),  k("F5_Key_Dark.png",  "F5"),  k("F6_Key_Dark.png",  "F6"),
    k("F7_Key_Dark.png",  "F7"),  k("F8_Key_Dark.png",  "F8"),  k("F9_Key_Dark.png",  "F9"),
    k("F10_Key_Dark.png", "F10"), k("F11_Key_Dark.png", "F11"), k("F12_Key_Dark.png", "F12"),
    // Misc navigation
    k("Print_Screen_Key_Dark.png", "PrtSc"),
    k("Num_Lock_Key_Dark.png",     "NmLk"),
    k("Insert_Key_Dark.png",    "Ins"),
    k("Home_Key_Dark.png",      "Home"),
    k("Page_Up_Key_Dark.png",   "PgUp"),
    k("Del_Key_Dark.png",       "Del"),
    k("End_Key_Dark.png",       "End"),
    k("Page_Down_Key_Dark.png", "PgDn"),
    // Arrows
    k("Arrow_Right_Key_Dark.png", "→"),
    k("Arrow_Left_Key_Dark.png",  "←"),
    k("Arrow_Down_Key_Dark.png",  "↓"),
    k("Arrow_Up_Key_Dark.png",    "↑"),
    // Modifiers
    k("Shift_Key_Dark.png",    "Shift"),
    k("Shift_Alt_Key_Dark.png","Shift"),
    k("Ctrl_Key_Dark.png",     "Ctrl"),
    k("Alt_Key_Dark.png",      "Alt"),
    k("Win_Key_Dark.png",      "Win"),
    k("Command_Key_Dark.png",  "Cmd"),
    // Alternate shapes
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
    // Numpad extras
    k("10_Key_Dark.png", "10"),
    k("11_Key_Dark.png", "11"),
    k("12_Key_Dark.png", "12"),
];

const KEYBOARD_ICONS_LIGHT = KEYBOARD_ICONS.map(({ file, label }) => ({
    file: file.replace(DIR.kb, DIR.kbLight).replace("_Dark.", "_Light."),
    label,
}));

// ── Sanity checks ─────────────────────────────────────────────────────────────

for (const [col, slots] of Object.entries(CONTROLLER_ROWS)) {
    if (slots.length !== NUM_SLOTS)
        throw new Error(`Controller col ${col}: expected ${NUM_SLOTS} slots, got ${slots.length}`);
}
if (SLOT_LABELS.length !== NUM_SLOTS)
    throw new Error(`SLOT_LABELS: expected ${NUM_SLOTS}, got ${SLOT_LABELS.length}`);
if (CONTROLLER_LABELS.length !== NUM_CONTROLLERS)
    throw new Error(`CONTROLLER_LABELS: expected ${NUM_CONTROLLERS}, got ${CONTROLLER_LABELS.length}`);

// ── Layout objects ────────────────────────────────────────────────────────────
//
// Each layout describes where icons land in pixel space.
// renderIcons() uses these; chrome functions use the labeled constants directly.

const kbRows         = Math.ceil(KEYBOARD_ICONS.length / KEYS_PER_ROW);
const kbSectionWidth = KEYS_PER_ROW * CELL;
const ctrlSectionW   = NUM_CONTROLLERS * CELL;

const DIAG_COLS       = [2, 3, 5];
const DIAG_COL_LABELS = ["Xbox", "PlayStation", "Switch"];

// Labeled layout — includes left label strip, title banner, and section headers
const titleBannerH      = 4 + TITLE_LINES.length * TITLE_LINE_H + 8;
const LBL_KB_X          = LABEL_WIDTH + ctrlSectionW + KB_GAP;
const LBL_ctrlVBase     = titleBannerH + HEADER_HEIGHT;
const LBL_kbVBase       = titleBannerH + HEADER_HEIGHT;
const LBL_kbLightVBase  = titleBannerH + 2 * HEADER_HEIGHT + kbRows * CELL;
const LBL_diagSectionY  = titleBannerH + 2 * (HEADER_HEIGHT + kbRows * CELL) + DIAG_GAP;

const LABELED = {
    width:      LBL_KB_X + kbSectionWidth,
    height:     Math.max(
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

// Clean layout — icons start at (0,0), no label strip, no header rows
const CLN_KB_X         = ctrlSectionW + KB_GAP;
const CLN_kbLightVBase = kbRows * CELL;
const CLN_diagSectionY = 2 * kbRows * CELL + DIAG_GAP;

const CLEAN = {
    width:      CLN_KB_X + kbSectionWidth,
    height:     Math.max(
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

// ── Draw primitives ───────────────────────────────────────────────────────────

function hRule(atlas, xStart, xEnd, y, color = 0x444444ff) {
    for (let x = xStart; x < xEnd; x++) atlas.setPixelColor(color, x, y);
}

function vRule(atlas, x, yStart, yEnd, color = 0x444444ff) {
    for (let y = yStart; y < yEnd; y++) atlas.setPixelColor(color, x, y);
}

function shadowPrint(atlas, fontW, fontB, x, y, text, w, h) {
    const opts = { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER };
    atlas.print(fontB, x + 1, y + 1, opts, w, h);
    atlas.print(fontW, x,     y,     opts, w, h);
}

async function blitIcon(atlas, srcPath, destX, destY, size, missing) {
    let icon;
    try { icon = await Jimp.read(srcPath); }
    catch { missing.push(srcPath); return; }
    icon.resize(size, size, Jimp.RESIZE_LANCZOS);
    atlas.composite(icon, destX, destY);
}

// ── Icon renderer — shared between both atlases ───────────────────────────────

async function renderIcons(atlas, layout, missing) {
    for (const [colStr, slots] of Object.entries(CONTROLLER_ROWS)) {
        const col = parseInt(colStr);
        for (let slot = 0; slot < slots.length; slot++) {
            if (!slots[slot]) continue;
            await blitIcon(atlas, slots[slot], layout.ctrlIconX(col), layout.ctrlIconY(slot), CELL, missing);
        }
    }

    for (let i = 0; i < KEYBOARD_ICONS.length; i++) {
        const col = i % KEYS_PER_ROW, row = Math.floor(i / KEYS_PER_ROW);
        await blitIcon(atlas, KEYBOARD_ICONS[i].file, layout.kbIconX(col), layout.kbDarkY(row), CELL, missing);
    }

    for (let i = 0; i < KEYBOARD_ICONS_LIGHT.length; i++) {
        const col = i % KEYS_PER_ROW, row = Math.floor(i / KEYS_PER_ROW);
        await blitIcon(atlas, KEYBOARD_ICONS_LIGHT[i].file, layout.kbIconX(col), layout.kbLightY(row), CELL, missing);
    }

    for (let ci = 0; ci < DIAG_COLS.length; ci++) {
        const srcPath = CONTROLLER_ROWS[DIAG_COLS[ci]][22];
        if (srcPath) await blitIcon(atlas, srcPath, layout.diagIconX, layout.diagIconY(ci), DIAG_CELL, missing);
    }
}

// ── Chrome renderers — labeled atlas only ─────────────────────────────────────

function renderTitleBanner(atlas, fontW, fontB) {
    for (let i = 0; i < TITLE_LINES.length; i++) {
        const y = 4 + i * TITLE_LINE_H;
        shadowPrint(atlas, fontW, fontB, 0, y, TITLE_LINES[i], LABELED.width, TITLE_LINE_H);
    }
    hRule(atlas, 0, LABELED.width, titleBannerH - 4);
}

function renderControllerChrome(atlas, fontW, fontB) {
    const headerY = titleBannerH + Math.floor((HEADER_HEIGHT - 16) / 2);
    for (let col = 0; col < NUM_CONTROLLERS; col++) {
        shadowPrint(atlas, fontW, fontB, LABEL_WIDTH + col * CELL, headerY, CONTROLLER_LABELS[col], CELL, HEADER_HEIGHT);
    }
    for (let slot = 0; slot < NUM_SLOTS; slot++) {
        const label = `${String(slot).padStart(2, "0")} ${SLOT_LABELS[slot] ?? slot}`;
        const y = LBL_ctrlVBase + slot * CELL + Math.floor((CELL - 8) / 2);
        atlas.print(fontB, 5, y + 1, label);
        atlas.print(fontW, 4, y,     label);
    }
}

function renderKeyboardChrome(atlas, fontW, fontB) {
    const darkHeaderY  = titleBannerH + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, darkHeaderY, "Keyboard (Dark)", kbSectionWidth, HEADER_HEIGHT);

    const lightHeaderY = titleBannerH + HEADER_HEIGHT + kbRows * CELL + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, lightHeaderY, "Keyboard (Light)", kbSectionWidth, HEADER_HEIGHT);
}

function renderDiagramsChrome(atlas, fontW, fontB) {
    hRule(atlas, LBL_KB_X, LBL_KB_X + kbSectionWidth, LBL_diagSectionY - Math.floor(DIAG_GAP / 2));

    const hdrY = LBL_diagSectionY + Math.floor((HEADER_HEIGHT - 16) / 2);
    shadowPrint(atlas, fontW, fontB, LBL_KB_X, hdrY, "Controller Diagrams", kbSectionWidth, HEADER_HEIGHT);

    for (let ci = 0; ci < DIAG_COLS.length; ci++) {
        const rowY   = LBL_diagSectionY + HEADER_HEIGHT + ci * (HEADER_HEIGHT + DIAG_CELL);
        const labelY = rowY + Math.floor((HEADER_HEIGHT - 16) / 2);
        shadowPrint(atlas, fontW, fontB, LBL_KB_X, labelY, DIAG_COL_LABELS[ci], DIAG_CELL, HEADER_HEIGHT);
    }
}

function renderWatermark(atlas, fontSmallW, fontSmallB) {
    const y = LABELED.height - WATERMARK_H + Math.floor((WATERMARK_H - 8) / 2);
    atlas.print(fontSmallB, 5,   y + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 4,   y,     WATERMARK_TEXT);
    atlas.print(fontSmallB, 600, y + 1, WATERMARK_TEXT);
    atlas.print(fontSmallW, 600, y,     WATERMARK_TEXT);
}

// ── README ────────────────────────────────────────────────────────────────────

function buildReadme() {
    const H = CELL / 2;

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
${DIAG_COLS.map((c, i) => `| ${i} | ${DIAG_COL_LABELS[i]} (col ${c}) |`).join("\n")}

\`\`\`
x = ${CLN_KB_X}
y = ${CLN_diagSectionY} + diagIndex * ${DIAG_CELL}
\`\`\`

---

## glyph_atlas_labeled.png offsets (reference only)

All icons are at the same relative positions but shifted by the label strip and headers:

| Section | X offset | Y offset |
|---------|----------|----------|
| Controller icons | \`${LABEL_WIDTH} + col * ${CELL}\` | \`${LBL_ctrlVBase} + slot * ${CELL}\` |
| Keyboard dark | \`${LBL_KB_X} + col * ${CELL}\` | \`${LBL_kbVBase} + row * ${CELL}\` |
| Keyboard light | \`${LBL_KB_X} + col * ${CELL}\` | \`${LBL_kbLightVBase} + row * ${CELL}\` |
| Diagrams | \`x = ${LBL_KB_X}\` | \`${LBL_diagSectionY} + ${HEADER_HEIGHT} + diagIndex * ${HEADER_HEIGHT + DIAG_CELL}\` |
`;
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
    const [fontW, fontB, fontSmallW, fontSmallB] = await Promise.all([
        Jimp.loadFont(Jimp.FONT_SANS_16_WHITE),
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK),
        Jimp.loadFont(Jimp.FONT_SANS_8_WHITE),
        Jimp.loadFont(Jimp.FONT_SANS_8_BLACK),
    ]);

    const missing = [];

    const cleanAtlas = await Jimp.create(CLEAN.width, CLEAN.height, 0x222222ff);
    await renderIcons(cleanAtlas, CLEAN, missing);

    const labeledAtlas = await Jimp.create(LABELED.width, LABELED.height, 0x222222ff);
    await renderIcons(labeledAtlas, LABELED, missing);
    renderTitleBanner(labeledAtlas, fontW, fontB);
    vRule(labeledAtlas, LABEL_WIDTH + ctrlSectionW + Math.floor(KB_GAP / 2), titleBannerH, LBL_diagSectionY);
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

    if (missing.length) {
        console.warn(`  ${missing.length} missing file(s):`);
        missing.forEach(f => console.warn(`    ${f}`));
    } else {
        console.log("  All source files found.");
    }
}

main().catch(err => { console.error(err); process.exit(1); });
