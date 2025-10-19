import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    })
    .nonempty("Email cannot be empty"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter (a-z)",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter (A-Z)",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number (0-9)",
    })
    .regex(/[!@#$%^&*]/, {
      message:
        "Password must contain at least one special character (!, @, #, $, %, ^, &, *)",
    })
    .nonempty("Password cannot be empty"),
});

export const registerSchema = z
  .object({
    firstName: z.string().nonempty("First name cannot be empty"),
    lastName: z.string().nonempty("Last name cannot be empty"),
    email: z
      .string()
      .email({
        message: "Please enter a valid email address",
      })
      .nonempty("Email cannot be empty"),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter (a-z)",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter (A-Z)",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number (0-9)",
      })
      .regex(/[!@#$%^&*]/, {
        message:
          "Password must contain at least one special character (!, @, #, $, %, ^, &, *)",
      })
      .nonempty("Password cannot be empty"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter (a-z)",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter (A-Z)",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number (0-9)",
      })
      .regex(/[!@#$%^&*]/, {
        message:
          "Password must contain at least one special character (!, @, #, $, %, ^, &, *)",
      })
      .nonempty("Password cannot be empty"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
