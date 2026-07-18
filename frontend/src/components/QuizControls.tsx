import { LeaderBoard } from "./leaderboard/Leaderboard";

interface QuizProblem {
    id: string;
    title: string;
    description: string;
    options: { id: number; title: string }[];
    image?: string;
}

export const QuizControls = ({
    socket,
    roomId,
    currentQuestion,
    leaderboard,
    showLeaderboard,
    onToggleLeaderboard,
    questionIndex,
    totalQuestions,
    onDeleteRoom,
}: {
    socket: any;
    roomId: string;
    currentQuestion: QuizProblem | null;
    leaderboard: { name: string; points: number; image?: string }[];
    showLeaderboard: boolean;
    onToggleLeaderboard: () => void;
    questionIndex: number;
    totalQuestions: number;
    onDeleteRoom: () => void;
}) => {
    const hasLeaderboard = leaderboard.length > 0;
    const quizNotStarted = !currentQuestion && !showLeaderboard && totalQuestions === 0;
    const isLastQuestion = totalQuestions > 0 && questionIndex === totalQuestions;

    return (
        <div className="space-y-4">
            {/* Current question preview */}
            {currentQuestion && !showLeaderboard && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                            Live Question {questionIndex}/{totalQuestions}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800 mb-4">
                        {currentQuestion.title}
                    </p>
                    {currentQuestion.image && (
                        <img
                            src={currentQuestion.image}
                            alt=""
                            className="w-full max-h-48 object-cover rounded-xl mb-4"
                        />
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        {currentQuestion.options.map((opt) => (
                            <div
                                key={opt.id}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-slate-700"
                            >
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                                    {String.fromCharCode(65 + opt.id)}
                                </span>
                                {opt.title}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Leaderboard (admin only, togglable) */}
            {showLeaderboard && hasLeaderboard && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                            Leaderboard
                        </h3>
                        <span className="text-xs text-gray-400">Admin only</span>
                    </div>
                    <LeaderBoard
                        leaderboardData={leaderboard.map((x) => ({
                            points: x.points,
                            username: x.name,
                        }))}
                    />
                </div>
            )}

            {/* Quiz not started yet */}
            {quizNotStarted && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center space-y-4">
                    <p className="text-gray-500">Ready when you are.</p>
                    <button
                        className="py-3 px-8 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99]"
                        onClick={() => {
                            socket.emit("next", { roomId });
                        }}
                    >
                        Start Quiz
                    </button>
                </div>
            )}

            {/* Between questions (leaderboard showing) with no current question and quiz already started */}
            {!currentQuestion && !showLeaderboard && !quizNotStarted && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <p className="text-gray-500">Preparing next question…</p>
                </div>
            )}

            {/* Controls bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {hasLeaderboard && (
                            <button
                                className={`py-2 px-5 rounded-xl text-sm font-medium transition ${showLeaderboard
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                                    }`}
                                onClick={onToggleLeaderboard}
                            >
                                {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
                            </button>
                        )}
                    </div>
                    {!quizNotStarted && (
                        isLastQuestion ? (
                            <button
                                className="py-2 px-6 rounded-xl font-medium bg-rose-600 text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.99]"
                                onClick={() => {

                                    onDeleteRoom();


                                }}
                            >
                                Delete Room &amp; Exit
                            </button>
                        ) : (
                            <button
                                className="py-2 px-6 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99]"
                                onClick={() => {
                                    socket.emit("next", { roomId });
                                }}
                            >
                                Next Question →
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};