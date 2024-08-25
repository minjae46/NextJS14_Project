import Link from "next/link";
import getSession from "@/lib/session";
import db from "@/lib/db";
import TweetList from "@/components/tweet-list";

async function getUserProfile(username: string) {
  const userProfile = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
    },
  });
  return userProfile;
}

async function getUserInitialTweets(id: number) {
  const tweets = await db.tweet.findMany({
    where: {
      userId: id,
    },
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

async function getIsUser(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  const userProfile = await getUserProfile(username);

  const userInitialTweets = await getUserInitialTweets(userProfile!.id);

  const isUser = await getIsUser(userProfile!.id);

  return (
    <div className="flex flex-col w-full my-6 gap-10">
      <Link
        href={"/"}
        className="text-slate-700 font-medium hover:text-slate-700 hover:font-bold transition"
      >
        Go Back to Home
      </Link>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-slate-700 font-semibold text-2xl">
            {userProfile?.username}
          </span>
          <span className="text-slate-400 font-md text-lg">
            {userProfile?.email}
          </span>
        </div>
        {isUser ? (
          <Link href={`/users/${username}/edit`}>
            <span className="text-sm text-slate-700 bg-slate-200 w-fit mx-0 px-4 py-3 rounded-md hover:opacity-90 transition">
              Edit Profile
            </span>
          </Link>
        ) : null}
      </div>
      <span className="text-slate-600 font-medium">{userProfile?.bio}</span>
      {userInitialTweets.length ? (
        <TweetList initialTweets={userInitialTweets} />
      ) : (
        <span>아직 작성한 트윗이 없습니다.</span>
      )}
    </div>
  );
}
