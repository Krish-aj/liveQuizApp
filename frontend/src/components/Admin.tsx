import { useEffect,useState,useCallback } from "react"
import { TemplateList } from "./admin/TemplateList"
import { TemplateBuilder } from "./admin/TemplateBuilder"
import { QuizControls } from "./QuizControls"
import { apiFetch } from "../lib/api"
import {type  QuizTemplate } from "../types/template"
import { AdminLogin } from "./admin/AdminLogin"
import { io,Socket } from "socket.io-client"

interface AdminProfile{
    name:string,
    email:string,
    picture?:string
}

const ACCESS_TOKEN="admin_token"

export const Admin= () =>{
    const [socket,setSocket] = useState<Socket | null>(null);
    const [profile, setProfile] = useState<AdminProfile|null>(null)
    const [token,setToken] =useState<string |null>(()=> localStorage.getItem(ACCESS_TOKEN))

    const [templates,setTemplates]=useState<QuizTemplate[]>([])
    const [view, setView] = useState<"list" | "new-template">("list")
    const [roomId, setRoomId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        if(!token) return 
        const s=io(import.meta.env.VITE_SERVER_URL,{
            auth: {token},
        });

        s.on("error",(data:{message:string}) => setError(data.message))
        s.on("roomCreated",(data:{roomId:string})=> setRoomId(data.roomId))
        setSocket(s)
        return ()=> {s.disconnect()}
    }, [token])

    const loadTemplates=useCallback(async ()=>{
        if(!token) return;
        try{
            const data=await apiFetch("/templates",token)
            setTemplates(data)
        }catch{
            localStorage.removeItem(ACCESS_TOKEN)
            setToken(null)
        }
    },[token])
    useEffect(()=> {loadTemplates()}, [loadTemplates])

    function handleLogin(newToken:string,admin:AdminProfile){
        localStorage.setItem(ACCESS_TOKEN,newToken);
        setToken(newToken);
        setProfile(admin)
    }

    function handleCreateRoom(templateId:string,newRoomId:string){
        if(!socket) return;
        setError(null)
        socket.emit("createRoomTemplate",{roomId:newRoomId,templateId})
    }
    if(!token){
        return <AdminLogin onLogin={handleLogin}/>
    }

    if(roomId && socket){
        return(
             <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-3xl space-y-3">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <p className="text-sm text-gray-500">Room code</p>
                        <p className="text-3xl font-semibold text-purple-600 tracking-widest">{roomId}</p>
                    </div>
                    <QuizControls socket={socket} roomId={roomId} />
                </div>
            </div>
        )
    }

   
         return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                {profile && (
                    <div className="flex items-center gap-3">
                        {profile.picture && <img src={profile.picture} alt="" className="w-8 h-8 rounded-full" />}
                        <p className="text-sm text-gray-500">Signed in as {profile.name}</p>
                    </div>
                )}
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