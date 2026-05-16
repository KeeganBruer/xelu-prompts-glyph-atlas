import Jimp from "jimp";

// Re-exported so other render files can type font parameters without importing Jimp.
export type Font      = Awaited<ReturnType<typeof Jimp.loadFont>>;
export type JimpImage = Jimp;

// ── Draw primitives ───────────────────────────────────────────────────────────

export function hRule(
    atlas: JimpImage, xStart: number, xEnd: number, y: number, color = 0x444444ff,
): void {
    for (let x = xStart; x < xEnd; x++) atlas.setPixelColor(color, x, y);
}

export function vRule(
    atlas: JimpImage, x: number, yStart: number, yEnd: number, color = 0x444444ff,
): void {
    for (let y = yStart; y < yEnd; y++) atlas.setPixelColor(color, x, y);
}

export function shadowPrint(
    atlas: JimpImage, fontW: Font, fontB: Font,
    x: number, y: number, text: string, w: number, h: number,
): void {
    const opts = { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER };
    atlas.print(fontB, x + 1, y + 1, opts, w, h);
    atlas.print(fontW, x,     y,     opts, w, h);
}

export async function blitIcon(
    atlas: JimpImage, srcPath: string,
    destX: number, destY: number, size: number,
    missing: string[],
): Promise<void> {
    const icon = await Jimp.read(srcPath).catch(() => { missing.push(srcPath); return null; });
    if (!icon) return;
    icon.resize(size, size, Jimp.RESIZE_BICUBIC);
    atlas.composite(icon, destX, destY);
}
