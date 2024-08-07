"use server";

import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z.object({
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
    .min(5, "Username should be at least 5 characters long."),
  password: z
    .string()
    .trim()
    .min(10, "Password should be at least 10 characters long.")
    .regex(
      passwordRegex,
      "Password should contain at least one number (0123456789)."
    ),
});

export async function handleForm(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);

  if (!result.success) return result.error.flatten();
  else return result;
}
