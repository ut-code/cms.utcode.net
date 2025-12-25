import { expect, test } from "@playwright/test";

test.describe("Admin Members", () => {
  test("should load members list page", async ({ page }) => {
    await page.goto("/admin/members");

    // Check page loaded successfully
    await expect(page).toHaveURL(/\/admin\/members/);

    // Page should have a heading or title
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should navigate to new member page", async ({ page }) => {
    await page.goto("/admin/members");

    // Look for "New Member" or "Create" button/link
    const newButton = page.getByRole("link", { name: /new|create|add/i }).first();

    if (await newButton.isVisible()) {
      await newButton.click();

      // Should navigate to new member page
      await expect(page).toHaveURL(/\/admin\/members\/new/);
    }
  });

  test("should display member form on new member page", async ({ page }) => {
    await page.goto("/admin/members/new");

    // Check for form elements
    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Should have input fields
    const inputs = page.locator("input, textarea, select");
    await expect(inputs.first()).toBeVisible();
  });
});
