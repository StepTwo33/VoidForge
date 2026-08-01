#!/usr/bin/env python3
"""Generate PWA icons and favicons from assets/app-icon-source.png (transparency preserved)."""

from __future__ import annotations

import collections
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "app-icon-source.png"
MASKABLE_SOURCE = ROOT / "assets" / "app-icon-maskable-source.png"
OUT_DIR = ROOT / "public" / "icons"
PUBLIC_DIR = ROOT / "public"
APP_DIR = ROOT / "src" / "app"

SITE_NAME = "Voidforge"
SITE_TAGLINE = "Warframe Build Planner"
SITE_DESCRIPTION = (
    "Plan and optimize Warframe builds with real-time stat calculations for "
    "weapons, warframes, companions, arcanes, and full loadouts."
)

FONT_CANDIDATES = (
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
)

# Fallback fill when a platform requires an opaque icon (favicon .ico)
BG = (10, 10, 26, 255)
TRANSPARENT = (0, 0, 0, 0)

STANDARD_SIZES = (192, 512)
MASKABLE_SIZES = (192, 512)
FAVICON_CROP = 0.82
CORNER_BG_TOLERANCE = 28


def ensure_rgba(img: Image.Image) -> Image.Image:
    return img.convert("RGBA")


def knock_out_corner_background(img: Image.Image, tolerance: int = CORNER_BG_TOLERANCE) -> Image.Image:
    """Turn outer black matte into transparency so the logo stays circular, not a square."""
    img = ensure_rgba(img).copy()
    pixels = img.load()
    width, height = img.size
    visited: set[tuple[int, int]] = set()
    queue: collections.deque[tuple[int, int]] = collections.deque()

    for x, y in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)):
        queue.append((x, y))

    def is_background(r: int, g: int, b: int) -> bool:
        return r <= tolerance and g <= tolerance and b <= tolerance

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        r, g, b, _a = pixels[x, y]
        if not is_background(r, g, b):
            continue
        visited.add((x, y))
        pixels[x, y] = TRANSPARENT
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return img


def resize_contain(
    img: Image.Image,
    size: int,
    bg: tuple[int, int, int, int] = TRANSPARENT,
) -> Image.Image:
    img = ensure_rgba(img)
    width, height = img.size
    scale = min(size / width, size / height)
    resized = img.resize((int(width * scale), int(height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg)
    offset = ((size - resized.width) // 2, (size - resized.height) // 2)
    canvas.paste(resized, offset, resized)
    return canvas


def center_crop_fraction(img: Image.Image, fraction: float) -> Image.Image:
    img = ensure_rgba(img)
    width, height = img.size
    crop = int(min(width, height) * fraction)
    left = (width - crop) // 2
    top = (height - crop) // 2
    return img.crop((left, top, left + crop, top + crop))


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if bold:
        candidates = [p for p in FONT_CANDIDATES if "Bold" in p or "bd" in p.lower()]
        candidates += [p for p in FONT_CANDIDATES if p not in candidates]
    else:
        candidates = list(FONT_CANDIDATES)
    for path in candidates:
        font_path = Path(path)
        if font_path.is_file():
            return ImageFont.truetype(str(font_path), size)
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def _lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def make_card_background(width: int, height: int) -> Image.Image:
    """linear-gradient(135deg, #0a0a1a 0%, #12122a 45%, #0a0a1a 100%)"""
    c0 = (10, 10, 26)
    c1 = (18, 18, 42)
    img = Image.new("RGB", (width, height))
    pixels = img.load()
    for y in range(height):
        for x in range(width):
            t = (x / max(width - 1, 1) + y / max(height - 1, 1)) / 2
            if t <= 0.45:
                u = t / 0.45
                rgb = (_lerp(c0[0], c1[0], u), _lerp(c0[1], c1[1], u), _lerp(c0[2], c1[2], u))
            else:
                u = (t - 0.45) / 0.55
                rgb = (_lerp(c1[0], c0[0], u), _lerp(c1[1], c0[1], u), _lerp(c1[2], c0[2], u))
            pixels[x, y] = rgb
    return img.convert("RGBA")


def add_radial_glow(
    canvas: Image.Image,
    cx: int,
    cy: int,
    radius: int,
    rgb: tuple[int, int, int],
    max_alpha: float,
) -> Image.Image:
    """Soft radial highlight that fades out (matches OG CSS radial-gradient)."""
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    pixels = overlay.load()
    w, h = canvas.size
    max_a = int(max_alpha * 255)
    for y in range(h):
        for x in range(w):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if dist >= radius:
                continue
            t = 1 - dist / radius
            alpha = int(max_a * t * t)
            if alpha > 0:
                pixels[x, y] = (*rgb, alpha)
    return Image.alpha_composite(canvas, overlay)


def make_og_embed(logo: Image.Image) -> Image.Image:
    """1200x630 social preview card — logo left, copy right."""
    width, height = 1200, 630
    canvas = make_card_background(width, height)
    # Subtle ambient glows (not solid dots) — same as original opengraph-image.tsx
    canvas = add_radial_glow(canvas, 140, 180, 260, (34, 211, 238), 0.18)
    canvas = add_radial_glow(canvas, width - 160, height - 60, 240, (168, 85, 247), 0.14)

    draw = ImageDraw.Draw(canvas)
    icon = resize_contain(logo, 280)
    icon_y = (height - icon.height) // 2
    canvas.paste(icon, (72, icon_y), icon)

    text_x = 72 + 280 + 56
    title_font = load_font(72, bold=True)
    tagline_font = load_font(34, bold=True)
    body_font = load_font(26)

    draw.text((text_x, 150), SITE_NAME, fill=(224, 247, 255, 255), font=title_font)
    draw.text((text_x, 250), SITE_TAGLINE, fill=(103, 232, 249, 255), font=tagline_font)

    body_y = 320
    for line in wrap_text(draw, SITE_DESCRIPTION, body_font, width - text_x - 72):
        draw.text((text_x, body_y), line, fill=(148, 163, 184, 255), font=body_font)
        body_y += 38

    return canvas.convert("RGB")


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ensure_rgba(img).save(path, format="PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)}")


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Missing source icon: {SOURCE}")

    raw = Image.open(SOURCE)
    source = knock_out_corner_background(raw)
    maskable_raw = Image.open(MASKABLE_SOURCE) if MASKABLE_SOURCE.is_file() else raw
    maskable_source = knock_out_corner_background(maskable_raw)
    favicon_source = center_crop_fraction(source, FAVICON_CROP)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print("Generating PWA icons (transparency preserved)...")

    for size in STANDARD_SIZES:
        save_png(resize_contain(source, size), OUT_DIR / f"icon-{size}x{size}.png")

    for size in MASKABLE_SIZES:
        save_png(resize_contain(maskable_source, size), OUT_DIR / f"maskable-{size}x{size}.png")

    save_png(resize_contain(source, 180), OUT_DIR / "apple-touch-icon.png")
    save_png(favicon_source.resize((32, 32), Image.Resampling.LANCZOS), OUT_DIR / "favicon-32x32.png")
    save_png(favicon_source.resize((16, 16), Image.Resampling.LANCZOS), OUT_DIR / "favicon-16x16.png")

    save_png(resize_contain(source, 48), APP_DIR / "icon.png")
    save_png(resize_contain(source, 180), APP_DIR / "apple-icon.png")

    # .ico needs opaque pixels — small crop on theme background
    favicon_32 = resize_contain(favicon_source, 32, BG).convert("RGBA")
    favicon_16 = resize_contain(favicon_source, 16, BG).convert("RGBA")
    favicon_path = PUBLIC_DIR / "favicon.ico"
    favicon_32.save(favicon_path, format="ICO", sizes=[(32, 32)], append_images=[favicon_16])
    print(f"  {favicon_path.relative_to(ROOT)}")

    save_png(make_og_embed(source), PUBLIC_DIR / "og-embed.png")

    print("\nDone.")


if __name__ == "__main__":
    main()
