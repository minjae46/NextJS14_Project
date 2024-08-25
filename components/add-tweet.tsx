"use client";

import { addTweet } from "@/app/(home)/actions";
import { useFormState } from "react-dom";
import FormBtn from "./form-btn";

export default function AddTweet() {
  const [state, action] = useFormState(addTweet, null);
  const errors = state?.fieldErrors.tweet;

  return (
    <form action={action}>
      <textarea
        name="tweet"
        placeholder="What is happening?"
        maxLength={110}
        required
        className="px-4 py-3 mb-1 placeholder:text-slate-400 bg-transparent rounded-xl w-full h-24 focus:outline-none ring-2 transition ring-slate-300 focus:ring-4 border-none resize-none"
      ></textarea>
      {errors?.map((error, index) => (
        <span key={index} className="text-red-600">
          {error}
        </span>
      ))}
      <FormBtn text="Post Tweet" />
    </form>
  );
}
