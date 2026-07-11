// import { useState,useEffect } from "react"
// import {CreateProblem} from "./CreateProblem.tsx"
// import { QuizControls } from './QuizControls.tsx'
// import { io } from "socket.io-client"


// export const Admin= () =>{

//     const [socket,setSocket] = useState<null | any>(null);
//     const [quizId, setQuizId] = useState("")
//     const [roomId,setRoomId] =useState("")

//     useEffect(()=>{
//         const socket = io("http://localhost:3000")
//         setSocket(socket)

//         socket.on("connect",()=>{
//             console.log(socket.id)
//             socket.emit("joinAdmin", {
//                 password: "ADMIN_PASSWORD"
//             })
//         })
       
//     }, [])
//     console.log("quizId:", quizId);
//     if (!quizId) {
//         return (<div>    
//         <input type="text" onChange={(e) => {
//             setRoomId(e.target.value)
//         }} />
//         <br />
//         <button onClick={() => {
//             socket.emit("createQuiz", {
//                 roomId
//             });
//             setQuizId(roomId);
//         }}>Create room</button>
//     </div>)
//     }
//     return <div>
//         <CreateProblem roomId={quizId} socket={socket} />
//         <QuizControls  socket={socket} roomId={roomId} />
//         </div>
// }

import { useState,useEffect } from "react"
import {CreateProblem} from "./CreateProblem.tsx"
import { QuizControls } from './QuizControls.tsx'
import { io } from "socket.io-client"
export const Admin= () =>{
    const [socket,setSocket] = useState<null | any>(null);
    const [quizId, setQuizId] = useState("")
    const [roomId,setRoomId] =useState("")
    useEffect(()=>{
        const socket = io("http://localhost:3000")
        setSocket(socket)
        socket.on("connect",()=>{
            console.log(socket.id)
            socket.emit("joinAdmin", {
                password: "ADMIN_PASSWORD"
            })
        })
       
    }, [])
    console.log("quizId:", quizId);
    if (!quizId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-semibold mb-1">
                            Admin
                        </p>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Create a room
                        </h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Room ID"
                        className="w-full text-center text-lg tracking-widest p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        onChange={(e) => {
                            setRoomId(e.target.value)
                        }}
                    />
                    <button
                        className="w-full mt-6 py-3 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!roomId.trim()}
                        onClick={() => {
                            socket.emit("createQuiz", {
                                roomId
                            });
                            setQuizId(roomId);
                        }}
                    >
                        Create room
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-white px-4 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                <CreateProblem roomId={quizId} socket={socket} />
                <QuizControls  socket={socket} roomId={roomId} />
            </div>
        </div>
    )
}