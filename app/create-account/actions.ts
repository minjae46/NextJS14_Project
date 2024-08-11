"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
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
        (email) => email.includes("gmail.com"),
        "Only @gmail.com emails are allowed."
      ),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Username should be at least 2 characters long."),
    password: z
      .string()
      .trim()
      .min(4, "Password should be at least 4 characters long.")
      .regex(
        passwordRegex,
        "Password should contain at least one number (0123456789)."
      ),
    passwordConfirm: z.string().trim(),
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "There is an account already registered with that email.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
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
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) return result.error.flatten();
  else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    await db.user.create({
      data: {
        email: result.data.email,
        username: result.data.username,
        password: hashedPassword,
      },
    });
    redirect("/log-in");
  }
}
