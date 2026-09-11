import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join } from "node:path";

const root = "/workspace/.grok/og-card";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".woff2": "font/woff2",
  ".css": "text/css",
};

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = join(root, rel);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}/`;

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const out = "/workspace/.grok/og-raw.png";
  await page.screenshot({ path: out, type: "png" });
  console.log(JSON.stringify({ ok: true, out, port }));
} finally {
  await browser.close();
  server.close();
}
