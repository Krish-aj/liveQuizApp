export const QuizControls =({socket,roomId}:{socket:any, roomId:string;})=>{
    return (
         <div className="flex items-center justify-between px-12 py-3">
            <h2 className="text-lg font-semibold text-slate-800">Quiz controls</h2>
            <button
                className="py-2 px-6 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99]"
                onClick={()=>{
                    socket.emit("next",{
                        roomId
                    })
                }}
            >
                Next problem
            </button>
        </div>
    )
}