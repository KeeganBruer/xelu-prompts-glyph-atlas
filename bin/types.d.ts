export interface Layout {
    width: number;
    height: number;
    ctrlIconX: (col: number) => number;
    ctrlIconY: (slot: number) => number;
    kbIconX: (col: number) => number;
    kbDarkY: (row: number) => number;
    kbLightY: (row: number) => number;
    diagIconX: number;
    diagIconY: (ci: number) => number;
}
export interface KeyIcon {
    file: string;
    label: string;
}
//# sourceMappingURL=types.d.ts.map