from PIL import Image, ImageDraw
from pathlib import Path

out_dir = Path(r"C:\Users\jason\Documents\framehub\public\icons")
public = Path(r"C:\Users\jason\Documents\framehub\public")
bg = (10, 10, 26, 255)  # #0a0a1a

# Prefer committed master; fall back to one-off import path.
src_candidates = [
    out_dir / "voidforge-icon-source.png",
    Path(
        r"C:\Users\jason\.cursor\projects\c-Users-jason-Documents-framehub\assets"
        r"\c__Users_jason_AppData_Roaming_Cursor_User_workspaceStorage_"
        r"73ff8d0b3a6bbd86b3de2578b8842fd7_images_IMG_5565-removebg-preview-"
        r"2c875063-f05f-4235-8f88-780fa650a93a.png"
    ),
]
src_path = next(p for p in src_candidates if p.exists())
src = Image.open(src_path).convert("RGBA")
print("source", src_path, src.size)


def square_pad(im: Image.Image, fill=(0, 0, 0, 0)) -> Image.Image:
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), fill)
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas


def resize(im: Image.Image, size: int) -> Image.Image:
    return im.resize((size, size), Image.Resampling.LANCZOS)


def rounded_square_icon(im: Image.Image, size: int) -> Image.Image:
    """Preserve source alpha so painted rounded corners stay rounded at export size."""
    return resize(im, size)


def to_circle(im: Image.Image) -> Image.Image:
    """Inscribed circle centered on the vortex; drops rounded-square corners."""
    side = min(im.size)
    # Slight inset so we sit inside the painted rounded-square frame.
    inset = max(1, int(side * 0.02))
    diam = side - inset * 2
    left = (im.size[0] - diam) // 2
    top = (im.size[1] - diam) // 2
    cropped = im.crop((left, top, left + diam, top + diam)).convert("RGBA")
    mask = Image.new("L", (diam, diam), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diam - 1, diam - 1), fill=255)
    out = Image.new("RGBA", (diam, diam), (0, 0, 0, 0))
    out.paste(cropped, (0, 0), mask)
    return out


def make_maskable(im: Image.Image, size: int, safe: float = 0.8) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    content = int(size * safe)
    icon = resize(im, content)
    base = Image.new("RGBA", icon.size, bg)
    base.alpha_composite(icon)
    offset = (size - content) // 2
    canvas.paste(base, (offset, offset))
    return canvas


# Only pad when importing a non-square asset; keep committed master as-is.
squared = src if src.size[0] == src.size[1] else square_pad(src, (0, 0, 0, 0))
opaque_master = Image.new("RGBA", squared.size, bg)
opaque_master.alpha_composite(squared)
circle_master = to_circle(opaque_master)

master_path = out_dir / "voidforge-icon-source.png"
if src_path != master_path:
    squared.save(master_path, "PNG")
    print("saved", master_path, squared.size)

circle_src_path = out_dir / "voidforge-icon-circle-source.png"
circle_master.save(circle_src_path, "PNG")
print("saved", circle_src_path, circle_master.size)

# Rounded-square set (PWA / favicon / Apple)
targets = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "icon-192x192.png": 192,
    "icon-512x512.png": 512,
}
for name, size in targets.items():
    out = rounded_square_icon(squared, size)
    path = out_dir / name
    out.save(path, "PNG", optimize=True)
    print("wrote", path.name, out.size, path.stat().st_size)

for size, name in [(192, "maskable-192x192.png"), (512, "maskable-512x512.png")]:
    out = make_maskable(squared, size)
    path = out_dir / name
    out.save(path, "PNG", optimize=True)
    print("wrote", path.name, out.size, path.stat().st_size)

# Circular set (in-app mark, avatars, places that want a true circle)
for size in (32, 64, 128, 192, 512):
    out = resize(circle_master, size)
    path = out_dir / f"icon-circle-{size}x{size}.png"
    out.save(path, "PNG", optimize=True)
    print("wrote", path.name, out.size, path.stat().st_size)

ico_sizes = [16, 32, 48]
ico_images = [rounded_square_icon(squared, s) for s in ico_sizes]
ico_path = public / "favicon.ico"
ico_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print("wrote favicon.ico", ico_path.stat().st_size)

# Discord/Twitter OG: landscape card with nebula fill (not a lonely icon on black).
W, H = 1200, 630
og = Image.new("RGBA", (W, H), bg)

# Soft full-bleed backdrop from a heavily blurred, cover-scaled copy of the art.
cover = opaque_master.copy()
scale = max(W / cover.size[0], H / cover.size[1]) * 1.15
cw, ch = int(cover.size[0] * scale), int(cover.size[1] * scale)
cover = cover.resize((cw, ch), Image.Resampling.LANCZOS)
left = (cw - W) // 2
top = (ch - H) // 2
cover = cover.crop((left, top, left + W, top + H))
try:
    from PIL import ImageFilter

    cover = cover.filter(ImageFilter.GaussianBlur(radius=28))
except Exception:
    pass
# Darken so the sharp icon reads on top
dim = Image.new("RGBA", (W, H), (10, 10, 26, 160))
og.alpha_composite(cover)
og.alpha_composite(dim)

# Primary mark — larger, slightly above center
icon_og = rounded_square_icon(squared, 460)
ox = (W - icon_og.size[0]) // 2
oy = 48
og.alpha_composite(icon_og, (ox, oy))

# Tagline under the mark
try:
    from PIL import ImageFont

    draw = ImageDraw.Draw(og)
    tagline = "Warframe Build Planner"
    font = None
    for cand in (
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ):
        if Path(cand).exists():
            font = ImageFont.truetype(cand, 36)
            break
    if font is None:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), tagline, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (W - tw) // 2
    ty = oy + icon_og.size[1] + 18
    # Soft glow
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        draw.text((tx + dx, ty + dy), tagline, font=font, fill=(80, 120, 200, 180))
    draw.text((tx, ty), tagline, font=font, fill=(210, 220, 255, 255))
except Exception as e:
    print("og tagline skipped:", e)

og_path = public / "og-embed.png"
og.save(og_path, "PNG", optimize=True)
print("wrote og-embed.png", og.size, og_path.stat().st_size)
print("done")
