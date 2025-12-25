import { expect, test } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test("should load admin dashboard page", async ({ page }) => {
    await page.goto("/admin");

    // Dashboard should be accessible
    await expect(page).toHaveTitle(/Admin/i);

    // Check for common dashboard elements
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should have navigation links to admin sections", async ({ page }) => {
    await page.goto("/admin");

    // Check for navigation to main admin sections
    const articlesLink = page.getByRole("link", { name: /articles/i });
    const projectsLink = page.getByRole("link", { name: /projects/i });
    const membersLink = page.getByRole("link", { name: /members/i });

    // At least one of these should exist in the navigation
    const hasNavigation =
      (await articlesLink.count()) > 0 ||
      (await projectsLink.count()) > 0 ||
      (await membersLink.count()) > 0;

    expect(hasNavigation).toBe(true);
  });
});
