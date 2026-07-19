import Card from "./Card";

export function LeaderBoard({
  leaderboardData,
}: {
  leaderboardData: {
    points: number;
    username: string;
  }[];
}) {
  return (
    <div className="bg-white border border-gray-100 shadow-lg p-6 rounded-2xl">
      <h1 className="text-2xl font-bold text-center my-4 text-slate-800">
        Leaderboard Results <span>🚀</span>
      </h1>
      <div className="space-y-2">
        {leaderboardData.map((el, index) => (
          <div key={index} className="relative flex justify-center">
            {index === 0 && (
              <div
                className="absolute -inset-1 rounded-xl blur-lg opacity-40 "
                aria-hidden
              />
            )}
            <div className="relative w-full flex items-center justify-center">
              <Card
                sno={index + 1}
                name={el.username}
                points={Math.floor(el.points)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}