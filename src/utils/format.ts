export function formatValidationError(errors: unknown) {
  if (!errors || !errors.issues) return 'Validation failed.';

  if (Array.isArray(errors.issues))
    return errors.issues.map((issue: unknown) => issue.message).join(', ');

  return JSON.stringify(errors);
}
