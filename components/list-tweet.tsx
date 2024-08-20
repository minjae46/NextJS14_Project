"use client";

interface ListTweetProps {
  tweet: string;
  created_at: Date;
  user: {
    username: string;
  };
  _count: {
    likes: number;
    responses: number;
  };
}

export default function ListTweet({
  tweet,
  created_at,
  user,
  _count,
}: ListTweetProps) {
  return (
    <div className="flex flex-col px-6 py-4 gap-2 rounded-xl ring-4 ring-slate-300 hover:bg-slate-300 transition">
      <span className="text-lg font-medium text-slate-700">{tweet}</span>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">
          {created_at.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })}
        </span>
        <span className="text-md text-slate-500">{user.username}</span>
      </div>
      <div className="flex justify-between">
        <span>{`좋아요 : ${_count.likes}`}</span>
        <span>{`댓글 : ${_count.responses}`}</span>
      </div>
    </div>
  );
}
