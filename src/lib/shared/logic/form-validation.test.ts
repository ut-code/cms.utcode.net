import { describe, expect, test } from "bun:test";
import { createFormValidator } from "./form-validation";

describe("createFormValidator", () => {
  test("should validate required fields", () => {
    const validator = createFormValidator<{ name: string; email: string }>();

    validator.required("name", " ", "Name is required");
    validator.required("email", "", "Email is required");

    const errors = validator.getErrors();
    expect(Object.keys(errors).length).toBe(2);
    expect(errors.name).toBe("Name is required");
    expect(errors.email).toBe("Email is required");
  });

  test("should validate with custom validator", () => {
    const validator = createFormValidator<{ slug: string }>();

    validator.validate("slug", "invalid slug!", (value) =>
      /^[a-z0-9-]+$/.test(value) ? null : "Invalid format",
    );

    const errors = validator.getErrors();
    expect(errors.slug).toBe("Invalid format");
  });

  test("should return empty errors when all validations pass", () => {
    const validator = createFormValidator<{ name: string }>();

    validator.required("name", "John Doe", "Name is required");

    const errors = validator.getErrors();
    expect(Object.keys(errors).length).toBe(0);
  });

  test("should chain validations", () => {
    const validator = createFormValidator<{ slug: string }>();

    validator
      .required("slug", "my-slug", "Slug is required")
      .validate("slug", "my-slug", (value) =>
        /^[a-z0-9-]+$/.test(value) ? null : "Invalid format",
      );

    const errors = validator.getErrors();
    expect(Object.keys(errors).length).toBe(0);
  });

  test("should not override existing errors", () => {
    const validator = createFormValidator<{ slug: string }>();

    validator
      .required("slug", "", "Slug is required")
      .validate("slug", "", (value) => (/^[a-z0-9-]+$/.test(value) ? null : "Invalid format"));

    const errors = validator.getErrors();
    expect(errors.slug).toBe("Slug is required");
  });

  test("should check hasErrors correctly", () => {
    const validator1 = createFormValidator<{ name: string }>();
    validator1.required("name", "", "Name is required");
    expect(validator1.hasErrors()).toBe(true);

    const validator2 = createFormValidator<{ name: string }>();
    validator2.required("name", "John", "Name is required");
    expect(validator2.hasErrors()).toBe(false);
  });
});
