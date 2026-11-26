import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const tools = JSON.parse(readFileSync(new URL("../src/api/tools.json", import.meta.url), "utf8"))
  .filter(({ hidden }) => !hidden);

for (const width of [320, 390]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 800 }, hasTouch: true, isMobile: true });

    for (const { title, category, slug } of tools) {
      test(`${title} stays within the viewport`, async ({ page }) => {
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${category}/${slug}`);
        await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
        await expect(page.getByRole("button", { name: "Browse tools" })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        expect(errors).toEqual([]);
      });
    }
  });
}
