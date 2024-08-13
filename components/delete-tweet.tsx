"use client";

import { deleteTweet } from "@/app/tweets/[id]/actions";
import FormBtn from "./form-btn";

export default function DeleteTweet({ id }: { id: number }) {
  return (
    <form action={() => deleteTweet(id)}>
      <FormBtn text="Delete Tweet" />
    </form>
  );
}
