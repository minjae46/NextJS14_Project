"use client";

import { useOptimistic } from "react";
import { likeTweet, dislikeTweet } from "@/app/tweets/[id]/actions";

interface LikeTweetProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeTweet({
  isLiked,
  likeCount,
  tweetId,
}: LikeTweetProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const action = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikeTweet(tweetId);
    } else {
      await likeTweet(tweetId);
    }
  };

  return (
    <form action={action} className="my-6 flex items-center">
      <button>
        <svg
          className={`${
            state.isLiked
              ? "fill-red-500 stroke-2 stroke-red-500"
              : "fill-none stroke-slate-500 stroke-2 hover:stroke-red-500"
          } w-7 mr-2 transition-colors`}
          data-slot="icon"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          stroke="red"
        >
          <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"></path>
        </svg>
      </button>
      <span className="text-md text-slate-500">{`마음에 들어요 ${state.likeCount}회`}</span>
    </form>
  );
}
