"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function likeTweet(tweetId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidatePath(`/tweets/${tweetId}`);
  } catch (e) {}
}

export async function dislikeTweet(tweetId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidatePath(`/tweets/${tweetId}`);
  } catch (e) {}
}

const responseSchema = z.object({
  response: z
    .string()
    .min(5, "Tweet should be at least 5 characters long.")
    .max(100, "The character limit has been exceeded."),
});

export async function addResponse({
  formData,
  tweetId,
}: {
  formData: FormData;
  tweetId: number;
}) {
  await new Promise((r) => setTimeout(r, 4000));

  const data = {
    response: formData.get("response"),
  };
  const result = await responseSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      await db.response.create({
        data: {
          response: result.data.response,
          user: {
            connect: {
              id: session.id,
            },
          },
          tweet: {
            connect: {
              id: tweetId,
            },
          },
        },
      });
      revalidatePath(`/tweets/${tweetId}`);
      return result.data.response;
    }
  }
}

export async function getNewResponse(tweetId: number) {
  const newResponse = await db.response.findFirst({
    where: {
      tweetId,
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      response: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return newResponse;
}

export async function getMoreResponses(tweetId: number, cursorId: number) {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
    select: {
      id: true,
      response: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: cursorId ? 1 : 0,
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });
  return responses;
}

export async function deleteTweet(tweetId: number) {
  await db.tweet.delete({
    where: {
      id: tweetId,
    },
  });
  redirect("/");
}
