"use client";

import type { PropsWithChildren } from "react";

import type { UseFormReturnType } from "@mantine/form";

import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { en } from "@/data/locale/en";
import type { SignInFormValues } from "./schemas";

type SignInFormProps = PropsWithChildren<{
  form: UseFormReturnType<SignInFormValues>;
}>;

export const SignInForm = ({ form }: SignInFormProps) => (
  <div className="grid gap-5">
    <FormField error={form.errors.email} label={en.auth.fields.email} name="email">
      <Input
        autoComplete="email"
        id="email"
        placeholder={en.auth.fields.emailPlaceholder}
        type="email"
        {...form.getInputProps("email")}
      />
    </FormField>
    <FormField error={form.errors.password} label={en.auth.fields.password} name="password">
      <Input
        autoComplete="current-password"
        id="password"
        placeholder={en.auth.fields.passwordPlaceholder}
        type="password"
        {...form.getInputProps("password")}
      />
    </FormField>
  </div>
);
