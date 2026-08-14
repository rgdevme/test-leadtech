import { z } from "zod";

import { en } from "@/data/locale/en";

export const signUpFormSchema = z
  .object({
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, en.auth.errors.weakPassword),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: en.auth.errors.passwordMismatch,
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
