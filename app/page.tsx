"use client";

import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function Home() {
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col w-full gap-10 mt-10">
      <h1 className="text-slate-700 font-semibold text-2xl">
        Welcome To My World
      </h1>
      <form action={action} className="flex flex-col gap-4">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormBtn text="Log in" />
      </form>
      {state?.success === true ? (
        <span className="text-green-500 font-semibold text-2xl">
          Welcome back!
        </span>
      ) : null}
    </div>
  );
}
