import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import TweetList from "@/components/tweet-list";
import AddTweet from "@/components/add-tweet";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
}

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          responses: true,
        },
      },
    },
    take: 3,
    orderBy: {
      created_at: "desc",
    },
  });
  return tweets;
}

export default async function Home() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/log-in");
  };

  const initialTweets = await getInitialTweets();

  return (
    <div className="flex flex-col w-full gap-6 my-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-700 font-semibold text-2xl">
          {user?.username}
        </span>
        <form action={logOut} className="flex justify-end">
          <button className="text-slate-700 font-medium text-sm hover:text-slate-700 hover:font-bold transition">
            로그아웃
          </button>
        </form>
      </div>
      <AddTweet />
      {initialTweets.length ? (
        <TweetList initialTweets={initialTweets} />
      ) : (
        <span>아직 트윗이 없습니다.</span>
      )}
    </div>
  );
}
