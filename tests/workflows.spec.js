import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a96sAAAAASUVORK5CYII=",
  "base64",
);

test("JSON formatting opens a lossless structural comparison", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  await page.getByRole("textbox", { name: "Input", exact: true }).fill('{"id":9007199254740992}');
  await page.getByRole("button", { name: "Format JSON" }).click();
  await expect(page.getByRole("textbox", { name: "Output" })).toHaveValue(/9007199254740992/);
  await page.getByRole("button", { name: "Compare with…" }).click();
  await expect(page.getByRole("textbox", { name: "Original JSON" })).toHaveValue(/9007199254740992/);
  await page.getByRole("textbox", { name: "Updated JSON" }).fill('{"id":9007199254740993}');
  await page.getByRole("button", { name: "Compare JSON" }).click();
  await expect(page.getByText("0 added · 0 removed · 1 changed")).toBeVisible();
  await expect(page.getByText("/id", { exact: true })).toBeVisible();
});

test("favorites persist and can be opened with the keyboard on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/tools/json-diff");
  const favorite = page.getByRole("button", { name: "Favorite JSON Diff" });
  await favorite.click();
  await page.reload();
  await expect(favorite).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Browse tools" }).click();
  await expect(page.getByRole("heading", { name: "Favorites" })).toBeVisible();
  await page.locator("header").getByRole("link", { name: "Dev Cheats", exact: true }).click();
  await page.getByRole("button", { name: "Search tools" }).click();
  await expect(page.getByRole("group", { name: "Favorites" }).getByRole("option")).toHaveCount(1);
  await page.getByRole("combobox").press("Enter");
  await expect(page).toHaveURL(/\/tools\/json-diff$/);
  await expect(page.getByRole("dialog")).toBeHidden();
  await favorite.click();
  await expect(favorite).toHaveAttribute("aria-pressed", "false");
});

test("share links restore contrast and fluid typography settings", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/tools/contrast-checker");
  await page.getByRole("textbox", { name: "Text color", exact: true }).fill("#abc");
  await page.getByRole("textbox", { name: "Background color", exact: true }).fill("#101010");
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByText("Link copied to clipboard.")).toBeVisible();
  await page.goto(await page.evaluate(() => navigator.clipboard.readText()));
  await expect(page.getByRole("textbox", { name: "Text color", exact: true })).toHaveValue("#AABBCC");
  await expect(page.getByRole("textbox", { name: "Background color", exact: true })).toHaveValue("#101010");

  await page.goto("/tools/css-clamp");
  await page.getByRole("spinbutton", { name: "Minimum font size in pixels" }).fill("18.5");
  await page.getByRole("slider").press("End");
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByText("Link copied to clipboard.")).toBeVisible();
  await page.goto(await page.evaluate(() => navigator.clipboard.readText()));
  await expect(page.getByRole("spinbutton", { name: "Minimum font size in pixels" })).toHaveValue("18.5");
  await expect(page.getByRole("slider")).toHaveValue("100");
});

test("Image Optimizer exports a WebP and supports keyboard comparison", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/image-optimizer");
  await page.locator('input[type="file"]').setInputFiles({ name: "sample.png", mimeType: "image/png", buffer: png });
  await page.getByRole("spinbutton", { name: "Width (px)" }).fill("2");
  await page.getByRole("button", { name: "Optimize image" }).click();
  await page.getByRole("button", { name: "Slider", exact: true }).click();
  const slider = page.getByRole("slider", { name: "Compare original and export" });
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuetext", "100% original, 0% export");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download WEBP" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sample-optimized.webp");
  expect((await readFile(await download.path())).subarray(8, 12).toString()).toBe("WEBP");
});

test("SVG Optimizer downloads the result from its worker", async ({ page }) => {
  await page.goto("/tools/svg-optimizer");
  await page.getByRole("button", { name: "Load example" }).click();
  await page.getByRole("button", { name: "Optimize SVG" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download SVG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("image-optimized.svg");
  const svg = await readFile(await download.path(), "utf8");
  expect(svg).toContain('viewBox="0 0 128 128"');
  expect(svg).toContain('id="code-mark"');
});

test("password generation works while the strength checker loads", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  let allowWorker;
  const workerReady = new Promise((resolve) => { allowWorker = resolve; });
  await page.route("**/passwordStrength.worker-*.js", async (route) => {
    await workerReady;
    await route.continue();
  });

  try {
    await page.goto("/generators/password-generator");
    const password = page.getByRole("textbox", { name: "Generated password" });
    await expect(password).toHaveValue(/^.{12}$/);
    await expect(page.getByText("Estimating strength…")).toBeVisible();
    await page.getByRole("slider", { name: "Length" }).press("End");
    await expect(password).toHaveValue(/^.{32}$/);
    expect(await password.evaluate((field) => field.scrollHeight <= field.clientHeight)).toBe(true);
  } finally {
    allowWorker();
  }

  await expect(page.getByText(/Estimated strength ·/)).toBeVisible();
});

test("URL Inspector focuses a new parameter and restores the original encoding", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/url-inspector");
  const original = "https://example.com/?q=hello%20world#section";
  await page.getByRole("textbox", { name: "Original URL" }).fill(original);
  await page.getByRole("button", { name: "Add parameter" }).click();
  const name = page.getByRole("textbox", { name: "Parameter 2 name" });
  await expect(name).toBeFocused();
  await name.fill("q");
  await page.getByRole("textbox", { name: "Parameter 2 value" }).fill("a&b");
  const result = page.getByRole("textbox", { name: "Updated URL" });
  await expect(result).toHaveValue("https://example.com/?q=hello+world&q=a%26b#section");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole("button", { name: "Reset edits" }).click();
  await expect(result).toHaveValue(original);
});

test("JSON Formatter focuses the reported syntax error", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  const input = page.getByRole("textbox", { name: "Input", exact: true });
  const invalid = "{\n" + '  "a": 0,\n'.repeat(20) + "}";
  await input.fill(invalid);
  await page.getByRole("button", { name: "Format JSON" }).click();
  await page.getByRole("button", { name: "Go to line 22, column 1" }).click();
  await expect(input).toBeFocused();
  expect(await input.evaluate((field) => field.selectionStart)).toBe(invalid.indexOf("}"));
});

test("Lorem Ipsum generates and copies the requested words", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/generators/lorem-ipsum");
  const generate = page.getByRole("button", { name: "Generate", exact: true });
  await expect(generate).toBeEnabled();
  await page.getByLabel("Format").selectOption("words");
  await page.getByLabel("Amount").fill("8");
  await generate.click();
  const result = page.getByRole("textbox", { name: "Generated text" });
  await expect(result).toHaveValue(/^(?:\S+\s+){7}\S+$/);
  await page.getByRole("button", { name: "Copy text" }).click();
  await expect(page.getByText("Copied to clipboard.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await result.inputValue());
});

test("CSS Shadow Builder previews, reorders and copies multiple layers", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/css-shadow");
  const output = page.getByRole("textbox", { name: "CSS", exact: true });
  await page.getByRole("spinbutton", { name: "Horizontal offset" }).fill("-8");
  await page.getByRole("button", { name: "Add layer" }).click();
  await page.getByRole("checkbox", { name: "Inset shadow" }).check();
  await page.getByRole("button", { name: "Move up", exact: true }).click();
  await expect(output).toHaveValue(/^box-shadow: inset 0px 4px 10px 0px rgb\(18 21 18 \/ 15%\),\n  -8px/);
  await expect(page.getByRole("region", { name: "Preview" }).locator("[style]"))
    .toHaveCSS("box-shadow", /inset.*-8px/);
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.getByRole("button", { name: "Dark", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Copy CSS" }).click();
  await expect(page.getByText("Copied to clipboard.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await output.inputValue());
  await page.getByRole("button", { name: "Remove layer" }).click();
  await page.getByRole("button", { name: "Remove layer" }).click();
  await expect(output).toHaveValue("box-shadow: none;");
});

test("Timestamp Converter preserves milliseconds and displays the selected zone", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/converters/timestamp-converter");

  const format = page.getByLabel("Input format");
  const input = page.getByRole("textbox", { name: "Timestamp" });
  await input.fill("-0.001");
  await expect(page.getByText("1969-12-31T23:59:59.999Z", { exact: true })).toBeVisible();
  await format.selectOption("milliseconds");
  await input.fill("1704067200000");
  await expect(page.getByText("2024-01-01T00:00:00.000Z", { exact: true })).toBeVisible();

  await format.selectOption("iso");
  await input.fill("2023-02-29T01:00:00Z");
  await expect(page.getByRole("alert")).toBeVisible();
  await input.fill("2024-01-01T01:00:00+01:00");
  await page.getByLabel("Display time zone").selectOption("Asia/Tokyo");
  await expect(page.getByText(/9:00:00.*(?:GMT\+9|JST|Japan)/)).toBeVisible();
  await page.getByRole("button", { name: "Copy Unix milliseconds", exact: true }).click();
  await expect(page.getByText("Unix milliseconds copied to clipboard.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("1704067200000");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("Text Diff highlights inline edits and reports line positions", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/text-diff");
  await page.getByRole("button", { name: "Load example" }).click();
  await page.getByRole("button", { name: "Compare text" }).click();

  const results = page.getByRole("region", { name: "Differences" });
  await expect(results.getByRole("status")).toHaveText("2 differences");
  await expect(results.getByText("Original · Line 2", { exact: true })).toBeVisible();
  await expect(results.getByText("Updated · Line 4", { exact: true })).toBeVisible();
  await expect(results.locator("mark")).toHaveText(["1", "2"]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

  await page.getByRole("button", { name: "Swap sides" }).click();
  await page.getByRole("button", { name: "Compare text" }).click();
  await expect(results.getByText("Removed", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Updated text" })
    .fill(await page.getByRole("textbox", { name: "Original text" }).inputValue());
  await page.getByRole("button", { name: "Compare text" }).click();
  await expect(results.getByRole("status")).toHaveText("The texts match.");
});
