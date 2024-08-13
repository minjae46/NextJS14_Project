import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteTweet from "@/components/delete-tweet";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getTweet(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return tweet;
}

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const tweet = await getTweet(id);
  if (!tweet) {
    return notFound();
  }

  const isOwner = await getIsOwner(tweet.userId);

  return (
    <div className="flex flex-col w-full gap-10 my-10">
      <h1 className="text-slate-700 font-semibold text-2xl">
        {tweet.user.username} Tweet
      </h1>
      <Link
        href={"/"}
        className="text-slate-700 font-medium hover:text-slate-700 hover:font-bold transition"
      >
        Go to List
      </Link>
      <div className="flex flex-col px-6 py-4 gap-2 rounded-xl ring-4 ring-slate-300">
        <span className="text-lg font-medium text-slate-700">
          {tweet.tweet}
        </span>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">
            {tweet.created_at.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </span>
          <span className="text-md text-slate-500">{tweet.user.username}</span>
        </div>
      </div>
      {isOwner ? <DeleteTweet id={id} /> : null}
    </div>
  );
}
