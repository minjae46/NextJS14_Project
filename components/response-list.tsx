"use client";

interface ResponsesProps {
  responses: {
    id: number;
    response: string;
    user: { username: string };
  }[];
}

export default function ResponseList({ responses }: ResponsesProps) {
  return (
    <div className="flex flex-col gap-4">
      {responses.map((response) => (
        <div
          key={response.id}
          className="flex items-center px-6 py-4 gap-2 rounded-xl ring-4 ring-slate-300"
        >
          <span className="text-md text-slate-500 font-bold mr-3">
            {response.user.username}
          </span>
          <span className="text-md text-slate-600">{response.response}</span>
        </div>
      ))}
    </div>
  );
}
