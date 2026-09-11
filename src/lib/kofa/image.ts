export async function fileToDataUrl(file: File): Promise<{ dataUrl: string; label: string }> {
  const bitmap = await createImageBitmap(file);
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.72), label: file.name };
}

export function demoReceiptDataUrl() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 860;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");
  ctx.fillStyle = "#f6f1e6";
  ctx.fillRect(0, 0, 640, 860);
  ctx.fillStyle = "#efe6d4";
  ctx.fillRect(24, 24, 592, 812);
  ctx.strokeStyle = "#c9bda8";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 568, 788);

  ctx.fillStyle = "#1a1814";
  ctx.font = "600 28px Georgia, serif";
  ctx.fillText("TAIWO GADGETS", 64, 100);
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillStyle = "#3a352e";
  ctx.fillText("Shop 2, Taiwo Road, Ilorin", 64, 132);
  ctx.fillText("TIN 01234567-0001", 64, 156);

  ctx.beginPath();
  ctx.moveTo(64, 180);
  ctx.lineTo(576, 180);
  ctx.strokeStyle = "#d7cfc0";
  ctx.stroke();

  const lines = [
    ["Date", "12 Aug 2026"],
    ["Item", "Tecno Spark 20"],
    ["IMEI", "3591 4401 2280 173"],
    ["Serial", "TN-ILR-88421"],
    ["Amount", "NGN 148,500"],
    ["Paid", "Cash"],
    ["Warranty", "14 days hardware"],
  ];
  ctx.font = "18px ui-monospace, monospace";
  lines.forEach((row, i) => {
    ctx.fillStyle = "#6b645a";
    ctx.fillText(row[0], 64, 230 + i * 42);
    ctx.fillStyle = "#1a1814";
    ctx.fillText(row[1], 280, 230 + i * 42);
  });

  ctx.font = "italic 16px Georgia, serif";
  ctx.fillStyle = "#6b645a";
  ctx.fillText("Keep this slip for warranty / unlock.", 64, 560);
  ctx.fillText("Not a Tunde Phone Clinic ticket.", 64, 586);

  ctx.font = "500 14px ui-monospace, monospace";
  ctx.fillText("DEMO RECEIPT — for Kofa photo test", 64, 780);
  return canvas.toDataURL("image/jpeg", 0.8);
}
