"use server";

export async function handleForm(prevState: any, formData: FormData) {
  const password = await formData.get("password");
  if (password === "12345") return { success: true };
  return { errors: ["Wrong password."] };
}
