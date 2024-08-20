"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidateTag, revalidatePath } from "next/cache";

export async function likeTweet(tweetId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
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
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}

const responseSchema = z.object({
  response: z
    .string()
    .min(5, "Tweet should be at least 5 characters long.")
    .max(100, "The character limit has been exceeded."),
});

export async function addResponse(
  prevState: any,
  { formData, tweetId }: { formData: FormData; tweetId: number }
) {
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
    }
  }
}

export async function deleteTweet(tweetId: number) {
  await db.tweet.delete({
    where: {
      id: tweetId,
    },
  });
  redirect("/");
}
