export interface CustomError extends Error {
  message: string;
}

export function isCustomError(error: unknown): error is CustomError {
  return error instanceof Error && typeof error.message === 'string';
}

export function getErrorMessage(error: unknown): string {
  if (isCustomError(error)) {
    return error.message;
  }
  return 'Unknown error occurred';
}
