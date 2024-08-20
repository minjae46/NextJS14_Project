"use client";

import Link from "next/link";
import ListTweet from "./list-tweet";
import { useState } from "react";
import { getNextTweets } from "@/app/(home)/actions";
import { getPrevTweets } from "@/app/(home)/actions";

interface TweetListProps {
  initialTweets: {
    id: number;
    tweet: string;
    created_at: Date;
    user: {
      username: string;
    };
    _count: {
      likes: number;
      responses: number;
    };
  }[];
}

export default function TweetList({ initialTweets }: TweetListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState(initialTweets);
  const [cursorId, setCursorId] = useState(
    initialTweets[initialTweets.length - 1].id
  );
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const onLoadNextClick = async () => {
    setIsLoading(true);
    const nextTweets = await getNextTweets(cursorId);
    const newCursorId = nextTweets[nextTweets.length - 1]?.id;
    if (nextTweets.length === 0) {
      setTweets([...tweets]);
      setCursorId(cursorId);
      setIsLastPage(true);
    }
    if (nextTweets.length >= 1 && nextTweets.length < 3) {
      setTweets([...nextTweets]);
      setPage((prev) => prev + 1);
      setCursorId(newCursorId);
      setIsLastPage(true);
    }
    if (nextTweets.length === 3) {
      setTweets([...nextTweets]);
      setPage((prev) => prev + 1);
      setCursorId(newCursorId);
    }
    setIsLoading(false);
  };

  const onLoadPrevClick = async () => {
    setIsLoading(true);
    const prevTweets = await getPrevTweets(cursorId, tweets.length);
    const newCursorId = prevTweets[prevTweets.length - 1].id;
    setTweets([...prevTweets]);
    setPage((prev) => prev - 1);
    setCursorId(newCursorId);
    setIsLastPage(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        {tweets.map((tweet) => (
          <Link key={tweet.id} href={`/tweets/${tweet.id}`}>
            <ListTweet {...tweet} />
          </Link>
        ))}
      </div>
      <div className="flex justify-between mt-10">
        {page === 1 ? (
          <button
            disabled={true}
            className="text-sm bg-gray-500 w-fit mx-0 px-3 py-2 rounded-md"
          >
            first page
          </button>
        ) : (
          <button
            onClick={onLoadPrevClick}
            disabled={isLoading}
            className="text-sm text-white bg-blue-500 w-fit mx-0 px-3 py-2 rounded-md hover:opacity-90 transition"
          >
            {isLoading ? "loading" : "prev page"}
          </button>
        )}

        {isLastPage ? (
          <button
            disabled={true}
            className="text-sm bg-gray-500 w-fit mx-0 px-3 py-2 rounded-md"
          >
            last page
          </button>
        ) : (
          <button
            onClick={onLoadNextClick}
            disabled={isLoading}
            className="text-sm text-white bg-blue-500 w-fit mx-0 px-3 py-2 rounded-md hover:opacity-90 transition"
          >
            {isLoading ? "loading" : "next page"}
          </button>
        )}
      </div>
    </div>
  );
}
