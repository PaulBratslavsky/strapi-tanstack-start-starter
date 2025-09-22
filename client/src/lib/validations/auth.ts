import { z } from "zod";

export const SigninFormSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username or email must be at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export type FormState = {
  success?: boolean;
  message?: string;
  data?: {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, Array<string>>;
  } | null;
  zodErrors?: {
    identifier?: Array<string>;
    username?: Array<string>;
    email?: Array<string>;
    password?: Array<string>;
  } | null;
};