import path from "node:path";
import { DIR, NUM_CONTROLLERS, NUM_SLOTS } from "../config.js";

const p = (dir: string, file: string): string => path.join(dir, file);
const DISCONNECTED = p(DIR.others, "Controller_Disconnected.png");

export type ControllerKey = 0 | 1 | 2 | 3 | 4 | 5;
export type ControllerSlots = ReadonlyArray<string | null>;

export const CONTROLLER_LABELS: readonly string[] = ["??", "GN", "XB", "PS", "SD", "SW"];

export const SLOT_LABELS: readonly string[] = [
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

const XBOX_ROW: ControllerSlots = [
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

export const CONTROLLER_ROWS: Readonly<Record<ControllerKey, ControllerSlots>> = {
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

// ── Validation ────────────────────────────────────────────────────────────────

for (const [col, slots] of Object.entries(CONTROLLER_ROWS)) {
    if (slots.length !== NUM_SLOTS)
        throw new Error(`Controller col ${col}: expected ${NUM_SLOTS} slots, got ${slots.length}`);
}
if (CONTROLLER_LABELS.length !== NUM_CONTROLLERS)
    throw new Error(`CONTROLLER_LABELS: expected ${NUM_CONTROLLERS}, got ${CONTROLLER_LABELS.length}`);
if (SLOT_LABELS.length !== NUM_SLOTS)
    throw new Error(`SLOT_LABELS: expected ${NUM_SLOTS}, got ${SLOT_LABELS.length}`);
