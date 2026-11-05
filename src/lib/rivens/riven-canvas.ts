import type { SavedRiven } from "./riven-storage";

/**
 * Draws a high-resolution, authentic Warframe Riven Card onto an HTML Canvas.
 * Can be exported as a downloadable PNG thumbnail or copied to clipboard.
 */
export async function renderRivenCardToCanvas(
  canvas: HTMLCanvasElement,
  riven: SavedRiven,
  scale = 2,
): Promise<void> {
  const width = 360 * scale;
  const height = 540 * scale;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.scale(scale, scale);

  const w = 360;
  const h = 540;
  const r = 16; // border radius

  // 1. Outer Dark Rounded Card Background
  ctx.beginPath();
  ctx.roundRect(4, 4, w - 8, h - 8, r);
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#190b2e");
  bgGrad.addColorStop(0.3, "#281048");
  bgGrad.addColorStop(0.7, "#1a0b30");
  bgGrad.addColorStop(1, "#0d0519");
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // 2. Glowing Riven Outer Border
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#9333ea";
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Inner subtle border
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.roundRect(8, 8, w - 16, h - 16, r - 4);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(216, 180, 254, 0.35)";
  ctx.stroke();

  // 3. Ornate Corner Brackets (Riven filigree)
  ctx.strokeStyle = "#c084fc";
  ctx.lineWidth = 2;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(14, 28);
  ctx.lineTo(14, 14);
  ctx.lineTo(28, 14);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(w - 28, 14);
  ctx.lineTo(w - 14, 14);
  ctx.lineTo(w - 14, 28);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(14, h - 28);
  ctx.lineTo(14, h - 14);
  ctx.lineTo(28, h - 14);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w - 28, h - 14);
  ctx.lineTo(w - 14, h - 14);
  ctx.lineTo(w - 14, h - 28);
  ctx.stroke();

  // 4. Header Bar: Drain, Polarity, MR
  // Drain & Polarity
  ctx.fillStyle = "#e9d5ff";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`⬡ 18`, 20, 36);

  ctx.fillStyle = "#c084fc";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.fillText(riven.polarity.toUpperCase(), 62, 36);

  // Mastery Rank Badge
  ctx.textAlign = "right";
  ctx.fillStyle = "#e9d5ff";
  ctx.fillText(`MR ${riven.masteryRank || 8}`, w - 20, 36);

  // 5. Card Artwork Banner / Header
  // Darker inset panel for art
  ctx.fillStyle = "rgba(10, 4, 18, 0.6)";
  ctx.fillRect(16, 48, w - 32, 110);
  ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
  ctx.strokeRect(16, 48, w - 32, 110);

  // Energy aura inside art panel
  const auraGrad = ctx.createRadialGradient(w / 2, 103, 10, w / 2, 103, 100);
  auraGrad.addColorStop(0, "rgba(168, 85, 247, 0.35)");
  auraGrad.addColorStop(1, "transparent");
  ctx.fillStyle = auraGrad;
  ctx.fillRect(16, 48, w - 32, 110);

  // Weapon category label
  ctx.fillStyle = "rgba(233, 213, 255, 0.7)";
  ctx.font = "10px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${riven.weaponType.toUpperCase()} RIVEN MOD`, w / 2, 70);

  // Weapon Name (large)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(riven.weaponName.toUpperCase(), w / 2, 100);

  // Roll Name
  const parts = riven.name.split(" ");
  const rollSuffix = parts.slice(1).join(" ") || "RIVEN";
  ctx.fillStyle = "#d8b4fe";
  ctx.font = "600 13px system-ui, -apple-system, sans-serif";
  ctx.fillText(rollSuffix.toUpperCase(), w / 2, 124);

  // Grade badge in art panel
  if (riven.grade) {
    const badgeW = 90;
    const badgeH = 18;
    const badgeX = w / 2 - badgeW / 2;
    const badgeY = 132;
    ctx.fillStyle = "rgba(20, 10, 35, 0.85)";
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 9);
    ctx.fill();
    ctx.strokeStyle = riven.gradeColor || "#c084fc";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = riven.gradeColor || "#c084fc";
    ctx.font = "bold 9px system-ui, -apple-system, sans-serif";
    ctx.fillText(riven.grade.toUpperCase(), w / 2, badgeY + 12);
  }

  // 6. Riven Stats Block
  let statY = 190;
  ctx.textAlign = "center";

  for (const s of riven.displayStats) {
    const isCurse = s.isCurse;
    const isSpliced = s.spliced;

    const sign = s.value >= 0 ? "+" : "";
    const formattedVal = s.key.startsWith("faction")
      ? `${(1 + s.value).toFixed(2)}x`
      : s.isPercent
      ? `${sign}${(s.value * 100).toFixed(1)}%`
      : `${sign}${s.value.toFixed(1)}`;
    const lineText = `${formattedVal} ${s.label}${isSpliced ? " [SPLICED]" : ""}`;

    if (isCurse) {
      ctx.fillStyle = "#f87171"; // soft red
    } else if (isSpliced) {
      ctx.fillStyle = "#2dd4bf"; // teal
    } else {
      ctx.fillStyle = "#38bdf8"; // bright cyan
    }

    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.fillText(lineText, w / 2, statY);
    statY += 26;
  }

  // 7. Rerolls & Details Divider
  ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
  ctx.beginPath();
  ctx.moveTo(32, 450);
  ctx.lineTo(w - 32, 450);
  ctx.stroke();

  // Reroll counter
  ctx.textAlign = "left";
  ctx.fillStyle = "#a855f7";
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.fillText(`⟳ ${riven.rerolls || 0} Cycles`, 24, 474);

  // Watermark
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(192, 132, 252, 0.6)";
  ctx.font = "10px system-ui, -apple-system, sans-serif";
  ctx.fillText("void-forge.org", w - 24, 474);

  // 8. Rank Pips at the bottom (8 filled cyan diamonds)
  const pipsY = 506;
  const pipSpacing = 14;
  const startX = w / 2 - (3.5 * pipSpacing);

  for (let i = 0; i < 8; i++) {
    const px = startX + i * pipSpacing;
    const filled = i < (riven.rank ?? 8);

    ctx.save();
    ctx.translate(px, pipsY);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-3.5, -3.5, 7, 7);

    if (filled) {
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 4;
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(216, 180, 254, 0.3)";
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Downloads the rendered canvas as a PNG file.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = filename.replace(/[^a-zA-Z0-9_-]/g, "_") + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * Copies the canvas image directly to the system clipboard.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch (err) {
    console.warn("Failed to copy image to clipboard", err);
    return false;
  }
}
