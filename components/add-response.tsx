"use client";

import { useState } from "react";
import { useOptimistic } from "react";
import { addResponse } from "@/app/tweets/[id]/actions";
import FormBtn from "./form-btn";
import ResponseList from "./response-list";

interface AddResponseProps {
  tweetId: number;
  responses: { id: number; response: string; user: { username: string } }[];
  username: string;
}

export default function AddResponse({
  tweetId,
  responses,
  username,
}: AddResponseProps) {
  const [errors, setErrors] = useState<string[] | undefined>([]);

  const [state, reducerFn] = useOptimistic(
    responses,
    (responses, payload: string) => {
      return [
        {
          id: 1,
          response: payload,
          user: {
            username: username,
          },
        },
        ...responses,
      ];
    }
  );

  const action = async ({
    formData,
    tweetId,
  }: {
    formData: FormData;
    tweetId: number;
  }) => {
    const newResponse = formData.get("response");
    reducerFn(newResponse);
    const result = await addResponse({ formData, tweetId });
    if (result?.fieldErrors) {
      setErrors(result?.fieldErrors.response);
    } else {
      setErrors([]);
    }
  };

  return (
    <div>
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
      <ResponseList responses={state} />
    </div>
  );
}
