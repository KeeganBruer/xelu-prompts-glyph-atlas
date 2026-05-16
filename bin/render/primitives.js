import Jimp from "jimp";
// ── Draw primitives ───────────────────────────────────────────────────────────
export function hRule(atlas, xStart, xEnd, y, color = 0x444444ff) {
    for (let x = xStart; x < xEnd; x++)
        atlas.setPixelColor(color, x, y);
}
export function vRule(atlas, x, yStart, yEnd, color = 0x444444ff) {
    for (let y = yStart; y < yEnd; y++)
        atlas.setPixelColor(color, x, y);
}
export function shadowPrint(atlas, fontW, fontB, x, y, text, w, h) {
    const opts = { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER };
    atlas.print(fontB, x + 1, y + 1, opts, w, h);
    atlas.print(fontW, x, y, opts, w, h);
}
export async function blitIcon(atlas, srcPath, destX, destY, size, missing) {
    const icon = await Jimp.read(srcPath).catch(() => { missing.push(srcPath); return null; });
    if (!icon)
        return;
    icon.resize(size, size, Jimp.RESIZE_BICUBIC);
    atlas.composite(icon, destX, destY);
}
//# sourceMappingURL=primitives.js.map