import Card from "./Card";

export function LeaderBoard({
  leaderboardData,
}: {
  leaderboardData: {
    points: number;
    username: string;
    profilePicture: string;
  }[];
}) {
  return (
    <div className="bg-panel/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40">
      <h1 className="font-display text-2xl font-bold text-center my-4 text-white">
        Leaderboard Results <span className="text-amber">🚀</span>
      </h1>
      <div className="space-y-2">
        {leaderboardData.map((el, index) => (
          <div key={index} className="relative flex justify-center">
            {index === 0 && (
              <div
                className="absolute -inset-1 rounded-xl blur-lg opacity-40 bg-amber"
                aria-hidden
              />
            )}
            <div className="relative w-full">
              <Card
                sno={index + 1}
                name={el.username}
                points={el.points}
                image={el.profilePicture}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}