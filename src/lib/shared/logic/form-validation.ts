/**
 * Creates a form validator for type-safe field validation
 */
export function createFormValidator<T extends Record<string, unknown>>() {
  const errors: Partial<Record<keyof T, string>> = {};

  return {
    /**
     * Validates that a field is not empty (after trimming)
     */
    required(field: keyof T, value: string, message: string) {
      if (!value.trim()) {
        errors[field] = message;
      }
      return this;
    },

    /**
     * Validates a field with a custom validator function
     * The validator should return null if valid, or an error message if invalid
     */
    validate(field: keyof T, value: string, validator: (value: string) => string | null) {
      // Only validate if no error already exists for this field
      if (!errors[field]) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
        }
      }
      return this;
    },

    /**
     * Returns all validation errors
     */
    getErrors(): Partial<Record<keyof T, string>> {
      return errors;
    },

    /**
     * Returns true if there are any validation errors
     */
    hasErrors(): boolean {
      return Object.keys(errors).length > 0;
    },
  };
}
