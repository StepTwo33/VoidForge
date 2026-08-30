from PIL import Image, ImageDraw
from pathlib import Path

src_path = Path(
    r"C:\Users\jason\.cursor\projects\c-Users-jason-Documents-framehub\assets"
    r"\c__Users_jason_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"73ff8d0b3a6bbd86b3de2578b8842fd7_images_IMG_5565-removebg-preview-"
    r"2c875063-f05f-4235-8f88-780fa650a93a.png"
)
out_dir = Path(r"C:\Users\jason\Documents\framehub\public\icons")
public = Path(r"C:\Users\jason\Documents\framehub\public")
bg = (10, 10, 26, 255)  # #0a0a1a

src = Image.open(src_path).convert("RGBA")


def square_pad(im: Image.Image, fill=(0, 0, 0, 0)) -> Image.Image:
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), fill)
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas


def resize(im: Image.Image, size: int) -> Image.Image:
    return im.resize((size, size), Image.Resampling.LANCZOS)


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


squared = square_pad(src, (0, 0, 0, 0))
opaque_master = Image.new("RGBA", squared.size, bg)
opaque_master.alpha_composite(squared)
circle_master = to_circle(opaque_master)

master_path = out_dir / "voidforge-icon-source.png"
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
    if name.startswith("icon-"):
        canvas = Image.new("RGBA", (size, size), bg)
        canvas.alpha_composite(resize(squared, size))
        out = canvas
    else:
        out = resize(opaque_master, size)
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
ico_images = [resize(opaque_master, s) for s in ico_sizes]
ico_path = public / "favicon.ico"
ico_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print("wrote favicon.ico", ico_path.stat().st_size)

og = Image.new("RGBA", (1200, 630), bg)
icon_og = resize(opaque_master, 420)
ox = (1200 - icon_og.size[0]) // 2
oy = (630 - icon_og.size[1]) // 2
og.alpha_composite(icon_og, (ox, oy))
og_path = public / "og-embed.png"
og.save(og_path, "PNG", optimize=True)
print("wrote og-embed.png", og.size, og_path.stat().st_size)
print("done")
