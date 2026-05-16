import Jimp from "jimp";
export type Font = Awaited<ReturnType<typeof Jimp.loadFont>>;
export type JimpImage = Jimp;
export declare function hRule(atlas: JimpImage, xStart: number, xEnd: number, y: number, color?: number): void;
export declare function vRule(atlas: JimpImage, x: number, yStart: number, yEnd: number, color?: number): void;
export declare function shadowPrint(atlas: JimpImage, fontW: Font, fontB: Font, x: number, y: number, text: string, w: number, h: number): void;
export declare function blitIcon(atlas: JimpImage, srcPath: string, destX: number, destY: number, size: number, missing: string[]): Promise<void>;
//# sourceMappingURL=primitives.d.ts.map