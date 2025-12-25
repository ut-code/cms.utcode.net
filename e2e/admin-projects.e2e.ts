import { expect, test } from "@playwright/test";

test.describe("Admin Projects", () => {
  test("should load projects list page", async ({ page }) => {
    await page.goto("/admin/projects");

    // Check page loaded successfully
    await expect(page).toHaveURL(/\/admin\/projects/);

    // Page should have a heading or title
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should navigate to new project page", async ({ page }) => {
    await page.goto("/admin/projects");

    // Look for "New Project" or "Create" button/link
    const newButton = page.getByRole("link", { name: /new|create/i }).first();

    if (await newButton.isVisible()) {
      await newButton.click();

      // Should navigate to new project page
      await expect(page).toHaveURL(/\/admin\/projects\/new/);
    }
  });

  test("should display project form on new project page", async ({ page }) => {
    await page.goto("/admin/projects/new");

    // Check for form elements
    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Should have input fields
    const inputs = page.locator("input, textarea");
    await expect(inputs.first()).toBeVisible();
  });
});
