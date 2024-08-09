"use server";

import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "This email is invalid." })
    .trim()
    .toLowerCase(),
  password: z.string().trim(),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);

  if (!result.success) return result.error.flatten();
  else return result;
}
