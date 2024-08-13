"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteTweet(id: number) {
  await db.tweet.delete({
    where: {
      id,
    },
  });
  redirect("/");
}
