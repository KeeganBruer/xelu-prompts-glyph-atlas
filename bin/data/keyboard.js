import path from "node:path";
import { DIR } from "../config.js";
const p = (dir, file) => path.join(dir, file);
const k = (file, label) => ({ file: p(DIR.kb, file), label });
export const KEYBOARD_ICONS = [
    // A–Z (SDL_SCANCODE 4–29)
    k("A_Key_Dark.png", "A"), k("B_Key_Dark.png", "B"), k("C_Key_Dark.png", "C"),
    k("D_Key_Dark.png", "D"), k("E_Key_Dark.png", "E"), k("F_Key_Dark.png", "F"),
    k("G_Key_Dark.png", "G"), k("H_Key_Dark.png", "H"), k("I_Key_Dark.png", "I"),
    k("J_Key_Dark.png", "J"), k("K_Key_Dark.png", "K"), k("L_Key_Dark.png", "L"),
    k("M_Key_Dark.png", "M"), k("N_Key_Dark.png", "N"), k("O_Key_Dark.png", "O"),
    k("P_Key_Dark.png", "P"), k("Q_Key_Dark.png", "Q"), k("R_Key_Dark.png", "R"),
    k("S_Key_Dark.png", "S"), k("T_Key_Dark.png", "T"), k("U_Key_Dark.png", "U"),
    k("V_Key_Dark.png", "V"), k("W_Key_Dark.png", "W"), k("X_Key_Dark.png", "X"),
    k("Y_Key_Dark.png", "Y"), k("Z_Key_Dark.png", "Z"),
    // 1–0 (SDL_SCANCODE 30–39)
    k("1_Key_Dark.png", "1"), k("2_Key_Dark.png", "2"), k("3_Key_Dark.png", "3"),
    k("4_Key_Dark.png", "4"), k("5_Key_Dark.png", "5"), k("6_Key_Dark.png", "6"),
    k("7_Key_Dark.png", "7"), k("8_Key_Dark.png", "8"), k("9_Key_Dark.png", "9"),
    k("0_Key_Dark.png", "0"),
    // SDL_SCANCODE 40–44
    k("Enter_Key_Dark.png", "Enter"),
    k("Esc_Key_Dark.png", "Esc"),
    k("Backspace_Key_Dark.png", "Bksp"),
    k("Tab_Key_Dark.png", "Tab"),
    k("Space_Key_Dark.png", "Space"),
    // SDL_SCANCODE 45–48
    k("Minus_Key_Dark.png", "-"),
    k("Plus_Key_Dark.png", "="),
    k("Bracket_Left_Key_Dark.png", "["),
    k("Bracket_Right_Key_Dark.png", "]"),
    // SDL_SCANCODE 51–53, 56
    k("Semicolon_Key_Dark.png", ";"),
    k("Quote_Key_Dark.png", "'"),
    k("Tilda_Key_Dark.png", "`"),
    k("Slash_Key_Dark.png", "/"),
    // SDL_SCANCODE 57 CapsLock
    k("Caps_Lock_Key_Dark.png", "Caps"),
    // F1–F12 (SDL_SCANCODE 58–69)
    k("F1_Key_Dark.png", "F1"), k("F2_Key_Dark.png", "F2"), k("F3_Key_Dark.png", "F3"),
    k("F4_Key_Dark.png", "F4"), k("F5_Key_Dark.png", "F5"), k("F6_Key_Dark.png", "F6"),
    k("F7_Key_Dark.png", "F7"), k("F8_Key_Dark.png", "F8"), k("F9_Key_Dark.png", "F9"),
    k("F10_Key_Dark.png", "F10"), k("F11_Key_Dark.png", "F11"), k("F12_Key_Dark.png", "F12"),
    // Misc navigation
    k("Print_Screen_Key_Dark.png", "PrtSc"),
    k("Num_Lock_Key_Dark.png", "NmLk"),
    k("Insert_Key_Dark.png", "Ins"),
    k("Home_Key_Dark.png", "Home"),
    k("Page_Up_Key_Dark.png", "PgUp"),
    k("Del_Key_Dark.png", "Del"),
    k("End_Key_Dark.png", "End"),
    k("Page_Down_Key_Dark.png", "PgDn"),
    // Arrows
    k("Arrow_Right_Key_Dark.png", "→"),
    k("Arrow_Left_Key_Dark.png", "←"),
    k("Arrow_Down_Key_Dark.png", "↓"),
    k("Arrow_Up_Key_Dark.png", "↑"),
    // Modifiers
    k("Shift_Key_Dark.png", "Shift"),
    k("Shift_Alt_Key_Dark.png", "Shift"),
    k("Ctrl_Key_Dark.png", "Ctrl"),
    k("Alt_Key_Dark.png", "Alt"),
    k("Win_Key_Dark.png", "Win"),
    k("Command_Key_Dark.png", "Cmd"),
    // Alternate shapes
    k("Enter_Alt_Key_Dark.png", "Enter"),
    k("Enter_Tall_Key_Dark.png", "Enter"),
    k("Backspace_Alt_Key_Dark.png", "Bksp"),
    k("Plus_Tall_Key_Dark.png", "+"),
    k("Asterisk_Key_Dark.png", "*"),
    k("Question_Key_Dark.png", "?"),
    k("Mark_Left_Key_Dark.png", "<"),
    k("Mark_Right_Key_Dark.png", ">"),
    // Mouse
    k("Mouse_Left_Key_Dark.png", "M.L"),
    k("Mouse_Right_Key_Dark.png", "M.R"),
    k("Mouse_Middle_Key_Dark.png", "M.Mid"),
    k("Mouse_Simple_Key_Dark.png", "Mouse"),
    // Numpad extras
    k("10_Key_Dark.png", "10"),
    k("11_Key_Dark.png", "11"),
    k("12_Key_Dark.png", "12"),
];
export const KEYBOARD_ICONS_LIGHT = KEYBOARD_ICONS.map(({ file, label }) => ({
    file: file.replace(DIR.kb, DIR.kbLight).replace("_Dark.", "_Light."),
    label,
}));
//# sourceMappingURL=keyboard.js.map