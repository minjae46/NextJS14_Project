"use client";

import { deleteTweet } from "@/app/tweets/[id]/actions";

export default function DeleteTweet({ tweetId }: { tweetId: number }) {
  return (
    <form action={() => deleteTweet(tweetId)}>
      <button>삭제하기</button>
    </form>
  );
}
