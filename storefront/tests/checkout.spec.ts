import { test, expect } from "@playwright/test";

test("/es/checkout can create a checkout with first variant", async ({ page }) => {
  await page.goto("/es/checkout");
  // Espera que el selector de variantes aparezca
  const select = page.locator("select").first();
  await expect(select).toBeVisible();

  // Seleccionar primera opción si existe
  const options = await select.locator("option").all();
  if (options.length > 1) {
    await select.selectOption({ index: 1 });
  }

  // Completar email
  const emailInput = page.getByLabel(/Email/i);
  await emailInput.fill("e2e@example.com");

  // Crear checkout
  const submit = page.getByRole("button", { name: /Crear checkout/i });
  await submit.click();

  // Ver resultado
  await expect(page.getByText("Resultado")).toBeVisible();
  await expect(page.getByText("Token:")).toBeVisible();
});