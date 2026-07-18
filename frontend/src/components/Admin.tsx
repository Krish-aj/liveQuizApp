import { useEffect,useState,useCallback } from "react"
import { TemplateList } from "./admin/TemplateList"
import { TemplateBuilder } from "./admin/TemplateBuilder"
import { QuizControls } from "./QuizControls"
import { apiFetch } from "../lib/api"
import {type  QuizTemplate } from "../types/template"
import { AdminLogin } from "./admin/AdminLogin"
import { io,Socket } from "socket.io-client"
import { AdminMenu } from "./admin/AdminMenu"

interface AdminProfile{
    name:string,
    email:string,
    picture?:string
}

interface QuizProblem {
    id: string;
    title: string;
    description: string;
    options: { id: number; title: string }[];
    image?: string;
}

const ACCESS_TOKEN="admin_token"
const PROFILE_KEY="admin_profile"

function readStoredProfile(): AdminProfile|null{
    const raw=localStorage.getItem(PROFILE_KEY);
    if(!raw) return null;
    try{
        return JSON.parse(raw) as AdminProfile
    }catch{
        return null;
    }
}

export const Admin= () =>{
    const [socket,setSocket] = useState<Socket | null>(null);
    const [profile, setProfile] = useState<AdminProfile|null>(()=>readStoredProfile())
    const [token,setToken] =useState<string |null>(()=> localStorage.getItem(ACCESS_TOKEN))

    const [templates,setTemplates]=useState<QuizTemplate[]>([])
    const [view, setView] = useState<"list" | "new-template">("list")
    const [roomId, setRoomId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Quiz live state
    const [currentQuestion, setCurrentQuestion] = useState<QuizProblem | null>(null)
    const [leaderboard, setLeaderboard] = useState<{name:string;points:number;image?:string}[]>([])
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [totalQuestions, setTotalQuestions] = useState(0)

    useEffect(()=>{
        if(!token) return 
        const s=io(import.meta.env.VITE_SERVER_URL,{
            auth: {token},
        });

        s.on("error",(data:{message:string}) => setError(data.message))
        s.on("roomCreated",(data:{roomId:string; totalQuestions?:number})=> {
            setRoomId(data.roomId)
            if(data.totalQuestions) setTotalQuestions(data.totalQuestions)
        })

        // Listen for quiz events (admin is in the room)
        s.on("problem",(data:{problem:QuizProblem; questionIndex?:number; totalQuestions?:number})=>{
            setCurrentQuestion(data.problem)
            setShowLeaderboard(false) // auto-switch to question view
            if(data.questionIndex != null) setQuestionIndex(data.questionIndex)
            if(data.totalQuestions != null) setTotalQuestions(data.totalQuestions)
        })

        s.on("leaderboard",(data:{leaderboard:{name:string;points:number;image?:string}[]})=>{
            setLeaderboard(data.leaderboard)
            setShowLeaderboard(true) // auto-show leaderboard on admin when it arrives
        })

        s.on("ended",(data:{leaderboard:{name:string;points:number;image?:string}[]})=>{
            setLeaderboard(data.leaderboard)
            setShowLeaderboard(true)
            setCurrentQuestion(null)
        })

        setSocket(s)
        return ()=> {s.disconnect()}
    }, [token])

    const loadTemplates=useCallback(async ()=>{
        if(!token) return;
        try{
            const data=await apiFetch("/templates",token)
            setTemplates(data)
        }catch{
            handleLogout();
        }
    },[token])
    useEffect(()=> {loadTemplates()}, [loadTemplates])

    function handleLogin(newToken:string,admin:AdminProfile){
        localStorage.setItem(ACCESS_TOKEN,newToken);
        localStorage.setItem(PROFILE_KEY,JSON.stringify(admin))
        setToken(newToken);
        setProfile(admin)
    }

    function handleLogout(){
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(PROFILE_KEY);
        socket?.disconnect()
        setSocket(null)
        setToken(null)
        setProfile(null)
        setRoomId(null)
        setTemplates([])
        setView("list")
        setCurrentQuestion(null)
        setLeaderboard([])
        setShowLeaderboard(false)
    }

    function handleCreateRoom(templateId:string,newRoomId:string){
        if(!socket) return;
        setError(null)
        socket.emit("createRoomFromTemplate",{roomId:newRoomId,templateId})
    }

    if(!token){
        return <AdminLogin onLogin={handleLogin}/>
    }

    if(roomId && socket){
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-3xl space-y-3">
                    <div className="flex items-center justify-between mb-3">
                        <div />
                        {profile && (
                            <AdminMenu profile={profile} onViewTemplates={() => {
                                setRoomId(null)
                                setCurrentQuestion(null)
                                setLeaderboard([])
                                setShowLeaderboard(false)
                            }} onLogout={handleLogout} />
                        )}
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <p className="text-sm text-gray-500">Room code</p>
                        <p className="text-3xl font-semibold text-purple-600 tracking-widest">{roomId}</p>
                    </div>
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">{error}</div>
                    )}
                    <QuizControls
                        socket={socket}
                        roomId={roomId}
                        currentQuestion={currentQuestion}
                        leaderboard={leaderboard}
                        showLeaderboard={showLeaderboard}
                        onToggleLeaderboard={() => setShowLeaderboard(prev => !prev)}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-end">
                    {profile && (
                        <AdminMenu profile={profile} onViewTemplates={() => setView("list")} onLogout={handleLogout} />
                    )}
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">{error}</div>
                )}

                {view === "list" ? (
                    <TemplateList
                        token={token}
                        templates={templates}
                        onCreateRoom={handleCreateRoom}
                        onDeleted={(id) => setTemplates((ts) => ts.filter((t) => t._id !== id))}
                        onNewTemplate={() => setView("new-template")}
                    />
                ) : (
                    <TemplateBuilder
                        token={token}
                        onCancle={() => setView("list")}
                        onSaved={() => { setView("list"); loadTemplates() }}
                    />
                )}
            </div>
        </div>
    )
}