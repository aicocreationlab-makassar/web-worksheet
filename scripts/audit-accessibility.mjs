import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const report = [];
async function audit(name) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = result.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  report.push({ name, violations });
  console.log(JSON.stringify({ name, violations }));
}
try {
  await page.goto("http://localhost:3000/create?template=ocean-matching");
  await page
    .getByRole("heading", { name: "Hari ini, mau menjelajah apa?" })
    .waitFor();
  for (let step = 0; step < 5; step++) {
    await audit(`wizard-${step + 1}`);
    if (step < 4) await page.getByRole("button", { name: "Lanjutkan" }).click();
  }
  await page.getByRole("button", { name: "Buat prompt-ku" }).click();
  await page.getByRole("textbox", { name: "Edit prompt worksheet" }).waitFor();
  await audit("populated-result");
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({
    path: "artifacts/result-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "artifacts/result-desktop.png",
    fullPage: true,
  });
  await page.goto("http://localhost:3000/");
  await audit("landing");
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await writeFile(
    "artifacts/accessibility.json",
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}
