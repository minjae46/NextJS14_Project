"use client";

import { useFormState } from "react-dom";
import FormBtn from "./form-btn";
import { addResponse } from "@/app/tweets/[id]/actions";

export default function AddResponse({ tweetId }: { tweetId: number }) {
  const [state, action] = useFormState(addResponse, null);
  const errors = state?.fieldErrors?.response;

  return (
    <form action={(formData) => action({ formData, tweetId })}>
      <textarea
        name="response"
        placeholder="What's your response?"
        maxLength={110}
        required
        className="px-4 py-3 placeholder:text-slate-400 bg-transparent rounded-xl w-full h-24 focus:outline-none ring-2 transition ring-slate-300 focus:ring-4 border-none resize-none"
      ></textarea>
      {errors?.map((error, index) => (
        <span key={index} className="text-red-600">
          {error}
        </span>
      ))}
      <FormBtn text="Post Response" />
    </form>
  );
}
