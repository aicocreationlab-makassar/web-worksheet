import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("mobile wizard, populated result and keyboard navigation", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/create?template=ocean-matching");
  for (let step = 0; step < 5; step++) {
    if (step === 1) {
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Untuk penjelajah usia berapa?" }),
      ).toBeVisible();
    }
    await expect(page.locator(".wizard-heading h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations
        .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
        .map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    if (step < 4) await page.getByRole("button", { name: "Lanjutkan" }).click();
  }
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit prompt worksheet" }),
  ).toBeVisible();
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    path: "test-results/result-mobile.png",
    fullPage: true,
  });
  const resultAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    resultAudit.violations
      .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
      .map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/result-desktop.png",
    fullPage: true,
  });
  await page.goto("/create");
  await page.getByRole("button", { name: "Edit Tema worksheet" }).click();
  const choice = page.getByRole("button", { name: "Hewan", exact: true });
  await choice.focus();
  await page.keyboard.press("Enter");
  await expect(choice).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({
    path: "test-results/generator-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("clipboard denial provides a useful manual copy message", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    });
    document.execCommand = () => false;
  });
  await page.goto("/create?template=farm-counting");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await page.getByRole("button", { name: "Salin prompt", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Ctrl+C");
});
test("complete wizard, validation, editing, copy, download and history", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page
    .getByRole("link", { name: "Buat worksheet gratis", exact: true })
    .click();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Lengkapi",
  );
  await page.getByRole("button", { name: "Bawah laut", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Bawah laut", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: /5–6 tahun/ }).click();
  await page.getByRole("button", { name: "Kembali", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Bawah laut", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(page.getByRole("button", { name: /5–6 tahun/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(page.getByRole("button", { name: /5–6 tahun/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: /^Mencocokkan/ }).click();
  await page
    .getByLabel("Tujuan belajar (opsional)")
    .fill("Mengenal pasangan hewan laut");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByLabel("Mode warna").selectOption("printer-friendly");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(page.getByText("Bawah laut", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Mengenal pasangan hewan laut", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await expect(page).toHaveURL("/result");
  const editor = page.getByRole("textbox", { name: "Edit prompt worksheet" });
  await expect(editor).toContainText("");
  const prompt = await editor.inputValue();
  expect(prompt).toContain("Mengenal pasangan hewan laut");
  expect(prompt).toContain("no gray fills");
  await editor.fill(prompt + "\n\nMy edited note.");
  await page.getByRole("button", { name: "Salin prompt", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Prompt tersalin");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "My edited note.",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh .txt" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "lembarceria-ocean.txt",
  );
  await page
    .getByRole("button", { name: "Salin perintah", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "gambar 2",
  );
  await expect(
    page.getByRole("link", { name: "Buka ChatGPT" }),
  ).toHaveAttribute("href", "https://chatgpt.com/");
  await page.goto("/history");
  await page.getByRole("button", { name: /Bawah laut/ }).click();
  await expect(editor).toHaveValue(/My edited note/);
  await page.reload();
  await expect(editor).toHaveValue(/My edited note/);
});
test("template search and prefill", async ({ page }) => {
  await page.goto("/templates");
  await page.getByRole("textbox", { name: "Cari template" }).fill("dinosaurus");
  await expect(page.locator(".template-card")).toHaveCount(1);
  await page.locator(".template-card").click();
  await expect(
    page.getByRole("button", { name: "Dinosaurus", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("custom theme cannot be empty and persists", async ({ page }) => {
  await page.goto("/create");
  await page.getByRole("button", { name: "Tema sendiri", exact: true }).click();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Isi pilihan",
  );
  await page.getByLabel("Ceritakan tema pilihanmu").fill("Kebun kupu-kupu");
  await page.reload();
  await expect(page.getByLabel("Ceritakan tema pilihanmu")).toHaveValue(
    "Kebun kupu-kupu",
  );
});
test("handles unavailable storage and direct empty results", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/result");
  await expect(
    page.getByRole("heading", { name: "Ide serumu dimulai di sini." }),
  ).toBeVisible();
  await page.goto("/create");
  await page.getByRole("button", { name: "Hewan", exact: true }).click();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(
    page.getByRole("heading", { name: "Untuk penjelajah usia berapa?" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Penyimpanan browser");
});
test("all routes fit mobile and desktop with no serious accessibility violations", async ({
  page,
}) => {
  for (const width of [360, 390, 430, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/create",
      "/templates",
      "/examples",
      "/how-it-works",
      "/history",
      "/result",
    ]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${path} overflows at ${width}px`).toBe(false);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  const home = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    home.violations
      .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
      .map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
  ).toEqual([]);
  await page.goto("/create");
  const wizard = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    wizard.violations
      .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
      .map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
  ).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
