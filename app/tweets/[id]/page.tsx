import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteTweet from "@/components/delete-tweet";
import LikeTweet from "@/components/like-tweet";
import { unstable_cache as nextCache } from "next/cache";
import AddResponse from "@/components/add-response";

async function getUsername() {
  const session = await getSession();
  if (session.id) {
    const username = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
      },
    });
    return username;
  }
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getTweet(tweetId: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
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
  });
  return tweet;
}

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        tweetId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}
async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["tweet-like-status"]);
  return cachedOperation(tweetId, userId!);
}

async function getInitialResponses(tweetId: number) {
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
    take: 3,
    orderBy: {
      created_at: "desc",
    },
  });
  return responses;
}
const getCachedInitialResponses = nextCache(getInitialResponses, [
  "response-list",
]);

async function getTotalResponses(tweetId: number) {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
  });
  return responses.length;
}

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const tweetId = Number(params.id);
  if (isNaN(tweetId)) {
    return notFound();
  }

  const tweet = await getTweet(tweetId);
  if (!tweet) {
    return notFound();
  }

  const username = await getUsername();

  const isOwner = await getIsOwner(tweet.userId);

  const { isLiked, likeCount } = await getCachedLikeStatus(tweetId);

  const initialResponses = await getCachedInitialResponses(tweetId);

  const totalResponses = await getTotalResponses(tweetId);

  return (
    <div className="flex flex-col w-full my-6">
      <Link
        href={"/"}
        className="text-slate-700 font-medium hover:text-slate-700 hover:font-bold transition mb-10"
      >
        Go to List
      </Link>
      <div className="flex flex-col px-6 py-4 gap-6 rounded-xl ring-4 ring-slate-300">
        <span className="text-xl font-semibold text-slate-500">
          {tweet.user.username}
        </span>
        <span className="text-lg font-medium text-slate-700">
          {tweet.tweet}
        </span>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">
            {tweet.created_at.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <LikeTweet isLiked={isLiked} likeCount={likeCount} tweetId={tweetId} />
        {isOwner ? <DeleteTweet tweetId={tweetId} /> : null}
      </div>

      <AddResponse
        tweetId={tweetId}
        initialResponses={initialResponses}
        totalResponses={totalResponses}
        username={username!.username}
      />
    </div>
  );
}
