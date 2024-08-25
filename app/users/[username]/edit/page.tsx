"use client";

import Link from "next/link";
import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useFormState } from "react-dom";
import { editUserProfile } from "./action";

export default function EditUserProfile({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  const [state, action] = useFormState(editUserProfile, null);

  return (
    <div className="flex flex-col w-full my-6 gap-10">
      <Link
        href={`/users/${username}`}
        className="text-slate-700 font-medium hover:text-slate-700 hover:font-bold transition"
      >
        Go Back to Profile
      </Link>
      <h1 className="text-slate-700 font-semibold text-2xl">Edit Profile</h1>

      <form
        action={(formData) => action({ formData, username })}
        className="flex flex-col gap-4"
      >
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors?.username}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors?.email}
        />

        <FormInput name="bio" type="text" placeholder="Bio" />
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
        <FormBtn text="Update Profile" />
      </form>
    </div>
  );
}
