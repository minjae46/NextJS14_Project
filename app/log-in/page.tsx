"use client";

import Link from "next/link";

import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import { useFormState } from "react-dom";
import { login } from "./actions";

export default function Login() {
  const [state, action] = useFormState(login, null);

  return (
    <div className="flex flex-col w-full gap-10 mt-10">
      <Link href="/">
        <h1 className="text-slate-700 font-semibold text-2xl">
          Welcome To My World
        </h1>
      </Link>
      <form action={action} className="flex flex-col gap-4">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors?.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors?.password}
        />
        <FormBtn text="Log in" />
      </form>
      <div className="flex gap-2 justify-center w-full text-slate-700 font-medium">
        <span>계정이 없으신가요?</span>
        <Link
          href="/create-account"
          className="hover:text-slate-700 hover:font-bold transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
