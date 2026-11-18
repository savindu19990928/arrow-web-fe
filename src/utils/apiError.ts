export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof ApiError) {
    if (err.message) return err.message;
    const first = err.errors ? Object.values(err.errors)[0]?.[0] : undefined;
    return first ?? fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}