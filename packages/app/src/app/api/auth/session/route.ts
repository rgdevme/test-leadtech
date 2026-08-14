import { createSessionRequestSchema } from "@leadtech/contracts";
import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ApiError } from "@/errors/apiError";
import { getFirebaseAdminAuth } from "@/firebase/server";
import { CSRF_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/guards/authentication";
import { upsertUser } from "@/repositories/users";
import {
  assertTrustedOrigin,
  constantTimeEqual,
  handleRoute,
  noStoreHeaders,
  parseJsonRequest,
  secureCookie,
} from "@/utils/http";
import { assertSessionRateLimit } from "@/utils/rateLimit";

const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60;
const RECENT_SIGN_IN_SECONDS = 5 * 60;

const clearSessionCookies = (response: NextResponse) => {
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  response.cookies.set(CSRF_COOKIE_NAME, "", { path: "/", maxAge: 0 });
};

export const POST = (request: Request) =>
  handleRoute(async () => {
    assertSessionRateLimit(request);
    assertTrustedOrigin(request);

    const body = await parseJsonRequest(request, createSessionRequestSchema);
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;

    if (!csrfCookie || !constantTimeEqual(csrfCookie, body.csrfToken)) {
      throw new ApiError(400, "invalid_request", "The sign-in request expired. Try again.");
    }

    const firebaseAuth = getFirebaseAdminAuth();
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(body.idToken, true);
    } catch (error) {
      throw new ApiError(401, "unauthenticated", "Please sign in again to continue.", {
        cause: error,
      });
    }
    const authenticationTime = decodedToken.auth_time;

    if (
      typeof authenticationTime !== "number" ||
      Date.now() / 1000 - authenticationTime > RECENT_SIGN_IN_SECONDS
    ) {
      throw new ApiError(401, "unauthenticated", "Please sign in again to continue.");
    }

    const sessionCookie = await firebaseAuth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    await upsertUser(
      decodedToken.uid,
      typeof decodedToken.email === "string" ? decodedToken.email : null,
    );

    const response = new NextResponse(null, { status: 204, headers: noStoreHeaders });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie(),
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    response.cookies.set(CSRF_COOKIE_NAME, "", { path: "/", maxAge: 0 });

    return response;
  });

export const DELETE = (request: Request) =>
  handleRoute(async () => {
    assertTrustedOrigin(request);
    const response = new NextResponse(null, { status: 204, headers: noStoreHeaders });
    clearSessionCookies(response);
    return response;
  });

export const GET = (request: Request) => {
  const redirectUrl = new URL("/sign-in", request.url);
  redirectUrl.searchParams.set("session", "expired");
  const response = NextResponse.redirect(redirectUrl, { headers: noStoreHeaders });
  clearSessionCookies(response);
  return response;
};
