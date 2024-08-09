"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full gap-10 mt-10">
      <h1 className="text-slate-700 font-semibold text-2xl">
        Welcome To My World
      </h1>
      <div className="flex flex-col gap-4">
        <Link href="/create-account">
          <div className="w-full h-10 flex justify-center items-center transition rounded-xl font-medium text-slate-600 bg-slate-200 hover:bg-slate-300">
            Create account
          </div>
        </Link>
        <Link href="/log-in">
          <div className="w-full h-10 flex justify-center items-center transition rounded-xl font-medium text-slate-600 bg-slate-200 hover:bg-slate-300">
            Log in
          </div>
        </Link>
      </div>
    </div>
  );
}
