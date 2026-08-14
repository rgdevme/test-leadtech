import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import type { z } from "zod";

import { ApiError, asApiError, toApiErrorResponse } from "@/errors/apiError";

export const noStoreHeaders = {
  "Cache-Control": "no-store",
};

export const assertJsonRequest = (request: Request) => {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new ApiError(400, "invalid_request", "Content-Type must be application/json.");
  }
};

export const parseJsonRequest = async <Schema extends z.ZodType>(
  request: Request,
  schema: Schema,
): Promise<z.infer<Schema>> => {
  assertJsonRequest(request);

  try {
    return schema.parse(await request.json()) as z.infer<Schema>;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(400, "invalid_request", "The request body must be valid JSON.", {
        cause: error,
      });
    }

    throw error;
  }
};

export const getApplicationUrl = () => {
  const value = process.env.APP_URL;
  if (!value) {
    throw new Error("APP_URL must be configured.");
  }

  return new URL(value);
};

export const assertTrustedOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  const expectedOrigin = getApplicationUrl().origin;

  if (!origin || origin !== expectedOrigin) {
    throw new ApiError(403, "forbidden", "The request origin is not trusted.");
  }
};

export const secureCookie = () => getApplicationUrl().protocol === "https:";

export const constantTimeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

type RouteHandlerResult = Response | Promise<Response>;

export const handleRoute = async (handler: (requestId: string) => RouteHandlerResult) => {
  const requestId = randomUUID();

  try {
    return await handler(requestId);
  } catch (error) {
    const apiError = asApiError(error);

    if (apiError.status >= 500) {
      console.error("Request failed.", {
        requestId,
        code: apiError.code,
        cause: apiError.cause instanceof Error ? apiError.cause.message : undefined,
      });
    }

    return NextResponse.json(toApiErrorResponse(apiError, requestId), {
      status: apiError.status,
      headers: { ...noStoreHeaders, ...apiError.headers },
    });
  }
};
