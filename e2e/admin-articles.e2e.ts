import { expect, test } from "@playwright/test";

test.describe("Admin Articles", () => {
  test("should load articles list page", async ({ page }) => {
    await page.goto("/admin/articles");

    // Check page loaded successfully
    await expect(page).toHaveURL(/\/admin\/articles/);

    // Page should have a heading or title
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should navigate to new article page", async ({ page }) => {
    await page.goto("/admin/articles");

    // Look for "New Article" or "Create" button/link
    const newButton = page.getByRole("link", { name: /new|create/i }).first();

    if (await newButton.isVisible()) {
      await newButton.click();

      // Should navigate to new article page
      await expect(page).toHaveURL(/\/admin\/articles\/new/);
    }
  });

  test("should display article form on new article page", async ({ page }) => {
    await page.goto("/admin/articles/new");

    // Check for form elements (title, content, etc.)
    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Should have input fields
    const inputs = page.locator("input, textarea");
    await expect(inputs.first()).toBeVisible();
  });
});
