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
    <form action={action}>
      <button
        className={`${
          state.isLiked
            ? "bg-red-400 ring-2 ring-red-400 text-white"
            : "text-neutral-400 hover:ring-2 hover:ring-red-400"
        } flex items-center gap-2 text-sm rounded-full p-2 transition-colors`}
      >
        <span>{`좋아요 (${state.likeCount})`}</span>
      </button>
    </form>
  );
}
