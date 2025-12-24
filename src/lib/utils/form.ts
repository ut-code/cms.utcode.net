/**
 * Programmatically triggers form submission by creating and dispatching a SubmitEvent.
 * @param handleSubmit - The form submit handler function
 * @param isSubmitting - Whether the form is currently submitting
 */
export function triggerSubmit(
  handleSubmit: (e: SubmitEvent) => Promise<void>,
  isSubmitting: boolean,
): void {
  if (!isSubmitting) handleSubmit(new SubmitEvent("submit")).catch(console.error);
}
