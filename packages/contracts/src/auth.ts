import { z } from "zod";

export const authUserSchema = z.object({
  uid: z.string().min(1),
  email: z.email().nullable(),
});

export const csrfTokenResponseSchema = z.object({
  csrfToken: z.string().min(32),
});

export const createSessionRequestSchema = z.object({
  idToken: z.string().min(1),
  csrfToken: z.string().min(32),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type CsrfTokenResponse = z.infer<typeof csrfTokenResponseSchema>;
export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;
