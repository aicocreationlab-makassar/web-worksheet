import { test, expect } from "@playwright/test";

test("personalized series can continue by exact command and full instructions", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/create?template=ocean-matching");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByLabel("Jumlah lembar worksheet").fill("3");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page
    .getByText("Jadikan khusus untuk si kecil", { exact: false })
    .click();
  await page.getByLabel("Nama anak", { exact: true }).fill("Alya Nūr");
  await page.getByLabel("Kelas atau kelompok").fill("TK B");
  await page.getByLabel("Sekolah atau tempat belajar").fill("Rumah Pelangi");
  await page.getByLabel("Judul seri worksheet").fill("Petualangan Alya");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(
    page.getByText("3 lembar · satu gambar per lembar"),
  ).toBeVisible();
  await expect(
    page.getByText("Alya Nūr · TK B · Rumah Pelangi · Petualangan Alya"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await expect(
    page.getByRole("heading", { name: "Dibuat khusus untuk Alya Nūr." }),
  ).toBeVisible();
  const initial = await page
    .getByRole("textbox", { name: "Edit prompt worksheet" })
    .inputValue();
  expect(initial).toContain("series of 3");
  expect(initial).toContain("Alya Nūr");
  expect(initial).toContain("Generate ONLY image 1 now");
  await page
    .getByRole("button", { name: "Salin perintah", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "lanjut gambar 2",
  );
  await page.getByLabel("Mau membuat gambar berapa?").selectOption("3");
  await page
    .getByRole("button", { name: "Salin perintah", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "lanjut gambar 3",
  );
  await page
    .getByText("Butuh instruksi lanjutan yang lebih lengkap?", { exact: false })
    .click();
  await page
    .getByRole("button", {
      name: "Salin instruksi lengkap gambar 3",
      exact: true,
    })
    .click();
  const continuation = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(continuation).toContain("Generate ONLY image 3 now");
  expect(continuation).toContain("Alya Nūr");
  expect(continuation).not.toContain("Generate ONLY image 1 now");
  await page.reload();
  await expect(page.getByLabel("Mau membuat gambar berapa?")).toHaveValue("3");
  await page.goto("/history");
  await page.getByRole("button", { name: /Alya Nūr/ }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit prompt worksheet" }),
  ).toHaveValue(/Alya Nūr/);
});

test("PWA manifest, icons and manual installation help are available", async ({
  page,
  request,
}) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.scope).toBe("/");
  expect(
    manifest.icons.some((i: { purpose: string }) => i.purpose === "maskable"),
  ).toBe(true);
  for (const icon of manifest.icons) {
    const image = await request.get(icon.src);
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toContain("image/png");
  }
  const sw = await request.get("/sw.js");
  expect(sw.ok()).toBe(true);
  expect(sw.headers()["cache-control"]).toContain("no-store");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Navigasi cepat" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pasang aplikasi", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Tambah ke Layar Utama");
  await page.getByRole("button", { name: "Mengerti" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("the complete generator and history work offline after precaching", async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  await page.goto("/create?template=farm-counting");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  const cached = await page.evaluate(async () => {
    const names = (await caches.keys()).filter((x) =>
      x.startsWith("lembarceria-"),
    );
    const cache = await caches.open(names[0]);
    return (
      Boolean(await cache.match("/create")) &&
      Boolean(await cache.match("/result")) &&
      Boolean(await cache.match("/history"))
    );
  });
  expect(cached).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Untuk penjelajah usia berapa?" }),
  ).toBeVisible();
  for (let step = 1; step < 4; step++)
    await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit prompt worksheet" }),
  ).toHaveValue(/Generate ONLY image 1 now/);
  await expect(page.locator(".offline-status")).toBeVisible();
  await page.goto("/history");
  await expect(page.locator(".history-card")).toHaveCount(1);
  await page.locator(".history-card").click();
  await expect(
    page.getByRole("textbox", { name: "Edit prompt worksheet" }),
  ).toHaveValue(/CONTINUATION PROTOCOL/);
  await context.setOffline(false);
});

test("page limits and optional identity clearing are usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/create?template=farm-counting");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByLabel("Jumlah lembar worksheet").fill("21");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await page.getByLabel("Jumlah lembar worksheet").fill("1");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page
    .getByText("Jadikan khusus untuk si kecil", { exact: false })
    .click();
  await page.getByLabel("Nama anak", { exact: true }).fill("Alya");
  await page.getByRole("button", { name: "Kosongkan personalisasi" }).click();
  await expect(page.getByLabel("Nama anak", { exact: true })).toHaveValue("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByRole("button", { name: "Siapkan worksheet-ku" }).click();
  await expect(
    page.getByRole("heading", { name: "Satu lembar, satu momen belajar." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Salin perintah", exact: true }),
  ).toHaveCount(0);
});
