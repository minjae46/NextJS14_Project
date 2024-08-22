"use client";

import { useState } from "react";
import { useOptimistic } from "react";
import { addResponse } from "@/app/tweets/[id]/actions";
import FormBtn from "./form-btn";
import ResponseList from "./response-list";
import { getMoreResponses } from "@/app/tweets/[id]/actions";

interface AddResponseProps {
  tweetId: number;
  initialResponses: {
    id: number;
    response: string;
    user: { username: string };
  }[];
  username: string;
}

export default function AddResponse({
  tweetId,
  initialResponses,
  username,
}: AddResponseProps) {
  const [responses, setResponses] = useState(initialResponses);
  const [cursorId, setCursorId] = useState(
    responses[responses.length - 1]?.id || 0
  );
  const [isLastResponse, setIsLastResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>([]);

  const [state, reducerFn] = useOptimistic(
    responses,
    (currentState, newResponse) => {
      return [
        {
          id: Math.random(),
          response: newResponse,
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

    setResponses((prev) => [
      {
        id: Math.random(),
        response: newResponse,
        user: {
          username: username,
        },
      },
      ...prev,
    ]);
    if (cursorId === 0) {
      setIsLastResponse(true);
    }
  };

  console.log("옵티미스틱 스테이트", state);
  console.log("그냥 스테이트", responses);

  const onLoadMoreResponsesClick = async () => {
    setIsLoading(true);
    const newResponses = await getMoreResponses(tweetId, cursorId);
    const newCursorId = newResponses[newResponses.length - 1]?.id;
    if (newResponses.length === 0) {
      setIsLastResponse(true);
    } else {
      setCursorId(newCursorId);
      setResponses((prev) => [...prev, ...newResponses]);
    }
    setIsLoading(false);
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
      {isLastResponse || responses.length === 0 ? null : (
        <button onClick={onLoadMoreResponsesClick} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
