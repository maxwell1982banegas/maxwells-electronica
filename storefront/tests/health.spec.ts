import { test, expect } from "@playwright/test";

test("/health shows OK", async ({ page }) => {
  await page.goto("/health");
  await expect(page.getByText("Healthcheck API")).toBeVisible();
  await expect(page.getByText("OK")).toBeVisible();
});