"use client";

interface ResponseListProps {
  responses: {
    id: number;
    response: string;
    user: {
      username: string;
    };
  }[];
}

export default function ResponseList({ responses }: ResponseListProps) {
  return (
    <div className="flex flex-col gap-6">
      {responses.map((response) => (
        <div
          key={response.id}
          className="flex justify-between items-center px-6 py-4 gap-2 rounded-xl ring-4 ring-slate-300"
        >
          <span className="text-lg font-medium text-slate-700">
            {response.response}
          </span>
          <span className="text-md text-slate-500">
            {response.user.username}
          </span>
        </div>
      ))}
    </div>
  );
}
