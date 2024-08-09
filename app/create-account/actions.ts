"use server";

import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z
  .object({
    email: z
      .string()
      .email({ message: "This email is invalid." })
      .trim()
      .toLowerCase()
      .refine(
        (email) => email.includes("zod.com"),
        "Only @zod.com emails are allowed."
      ),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Username should be at least 2 characters long."),
    password: z
      .string()
      .trim()
      .min(6, "Password should be at least 6 characters long.")
      .regex(
        passwordRegex,
        "Password should contain at least one number (0123456789)."
      ),
    passwordConfirm: z.string().trim(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: "Both passwords should be equal.",
    path: ["passwordConfirm"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };
  const result = formSchema.safeParse(data);

  if (!result.success) return result.error.flatten();
  else return result;
}
