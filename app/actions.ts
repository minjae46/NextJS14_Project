"use server";

import db from "@/lib/db";

export async function getNextTweets(cursorId: number) {
  const nextTweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: cursorId ? 1 : 0,
    take: 3,
    orderBy: {
      created_at: "desc",
    },
  });
  return nextTweets;
}

export async function getPrevTweets(cursorId: number, tweetslength: number) {
  const prevTweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: tweetslength,
    take: -3,
    orderBy: {
      created_at: "desc",
    },
  });
  return prevTweets;
}
