"use client";

import Link from "next/link";

import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

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
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors?.username}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors?.password}
        />
        <FormInput
          name="passwordConfirm"
          type="password"
          placeholder="Password confirm"
          required
          errors={state?.fieldErrors?.passwordConfirm}
        />
        <FormBtn text="Create account " />
      </form>
      <div className="flex gap-2 justify-center w-full text-slate-700 font-medium">
        <span>이미 계정이 있나요?</span>
        <Link
          href="/log-in"
          className="hover:text-slate-700 hover:font-bold transition"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
