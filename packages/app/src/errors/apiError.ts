import type { ApiErrorCode, ApiErrorResponse } from "@leadtech/contracts";
import { ZodError } from "zod";

type ApiErrorOptions = {
  cause?: unknown;
  fieldErrors?: Record<string, string[]>;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly fieldErrors?: Record<string, string[]>;
  readonly headers?: HeadersInit;
  readonly status: number;

  constructor(status: number, code: ApiErrorCode, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = options.fieldErrors;
    this.headers = options.headers;
  }
}

const zodFieldErrors = (error: ZodError) => {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).filter(
      (entry): entry is [string, string[]] => entry[1] !== undefined,
    ),
  );
};

export const asApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ApiError(400, "invalid_request", "The request contains invalid values.", {
      cause: error,
      fieldErrors: zodFieldErrors(error),
    });
  }

  return new ApiError(500, "internal_error", "The request could not be completed.", {
    cause: error,
  });
};

export const toApiErrorResponse = (error: ApiError, requestId: string): ApiErrorResponse => ({
  error: {
    code: error.code,
    message: error.message,
    ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    requestId,
  },
});
