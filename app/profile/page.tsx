import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div className="flex flex-col w-full gap-10 mt-10">
      <h1 className="text-slate-700 font-semibold text-2xl">
        Welcome, {user?.username}
      </h1>
      <form action={logOut}>
        <button className="text-slate-700 font-medium hover:text-slate-700 hover:font-bold transition">
          로그아웃
        </button>
      </form>
    </div>
  );
}
