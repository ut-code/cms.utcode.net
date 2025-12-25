import { expect, test } from "@playwright/test";

test.describe("Admin Authentication", () => {
  test("should allow access to admin pages when UNSAFE_DISABLE_AUTH is true", async ({ page }) => {
    // With UNSAFE_DISABLE_AUTH=true, admin pages should be accessible
    await page.goto("/admin");

    // Should not redirect to login
    await expect(page).toHaveURL(/\/admin/);

    // Page should load successfully
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should be able to access all admin sections without authentication", async ({ page }) => {
    const adminPaths = ["/admin", "/admin/articles", "/admin/projects", "/admin/members"];

    for (const path of adminPaths) {
      await page.goto(path);

      // Should not redirect to login page
      await expect(page).not.toHaveURL(/\/login/);

      // Page should load with content
      await expect(page.locator("body")).toBeVisible();
    }
  });
});
