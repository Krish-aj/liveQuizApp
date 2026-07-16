import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LeaderBoard } from "./leaderboard/Leaderboard.tsx";
import { Quiz } from "./Quiz.tsx";

export const User = () => {
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [code, setCode] = useState("");
   if (!submitted) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-purple-100 border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-20 rounded-xl  flex items-center justify-center text-purple-600 font-bold text-lg">
            Quiz-X
          </div>
          <h1 className="text-xl font-semibold text-slate-800">
            Enter the code to join
          </h1>
          
        </div>

        <div className="space-y-4 mb-6">
          <input
                className="w-full text-center text-lg tracking-widest font-medium p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
        />
            <input
                className="w-full text-center p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
        />
        </div>

        <button
          className="w-full bg-purple-600 text-white font-medium py-3 rounded-xl shadow-sm hover:bg-purple-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          disabled={!code.trim() || !name.trim()}
          onClick={() => setSubmitted(true)}
        >
          Join
        </button>
      </div>
    </div>
  );
}

    return <UserLoggedin code={code} name={name} />
}

export const UserLoggedin = ({name, code}:{name:string; code:string}) => {
    const [socket, setSocket] = useState<null | any>(null);
    const roomId = code;
    const [currentState, setCurrentState] = useState("not_started");
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setSocket(socket)

        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("join", {
                roomId,
                name
            })
        });
        
        socket.on("init", ({userId, state}) => {
            setUserId(userId);

            if (state.leaderboard) {
                setLeaderboard(state.leaderboard)
            }

            if (state.problem) {
                setCurrentQuestion(state.problem);
            }

            setCurrentState(state.type);
        });

        socket.on("leaderboard", (data) => {
            setCurrentState("leaderboard");
            setLeaderboard(data.leaderboard);
        });
        socket.on("problem", (data) => {
            setCurrentState("question");
            setCurrentQuestion(data.problem);
        })
        //ai fixing
        return () => {
        socket.disconnect();
        };

    }, []);

    //ai fixing
    if (!socket) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
            Connecting to server...
        </div>
    );
    }

    if (currentState === "not_started") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <p className="text-slate-600 text-lg">
                    This quiz hasnt started yet
                </p>
            </div>
        );
    }
    if (currentState === "question") {
        return <Quiz roomId={roomId} userId={userId} problemId={currentQuestion.id} quizData={{
            title: currentQuestion.description,
            options: currentQuestion.options
        }} socket={socket} />
    }

    if (currentState === "leaderboard") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <LeaderBoard leaderboardData={leaderboard.map((x: any) => ({
                        points: x.points,
                        username: x.name,
                        profilePicture: x.image
                    }))} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <p className="text-2xl font-semibold text-slate-800">Quiz has ended</p>
            <p className="text-gray-500 mt-1">{currentState}</p>
        </div>
    );
}