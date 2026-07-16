// import { useState } from "react"
// export const CreateProblem=({socket,roomId}: {socket:any; roomId:string;})=>{

//     const [title,setTitle]= useState("");
//     const [description,setDescription] = useState("")
//     const [answer,setAnswer]= useState(0)
//     const [options,setOptions] = useState([
//         {id:0, title:""},
//         {id:1, title:""},
//         {id:2, title:""},
//         {id:3, title:""}
//     ])
//     return <div>
//         Create problem
//         Title= <input type="text" onChange={(e)=>{
//             setTitle(e.target.value)
//         }} /> 
//         <br /> <br />

//          Description - <input type="text" onChange={(e)=>{
//             setDescription(e.target.value)
//         }} /> 
//         <br />

//         {[0, 1, 2, 3].map(optionId => <div> 
//             <input type="radio" checked={optionId === answer} onChange={() => {
//                 setAnswer(optionId)
//             }}></input>
//             Option {optionId}
//             <input type="text" onChange={(e) => {
//                 setOptions(options => options.map(x => {
//                     if (x.id === optionId) {
//                         return {
//                             ...x,
//                             title: e.target.value
//                         }
//                     }
//                     return x;
//                 }))
//             }} />
//         <br />
//         </div>)} 
    
//           <button onClick={() => {
//             socket.emit("createProblem", {
//                 roomId,
//                 problemId:{
//                     title,
//                     description,
//                     options,
//                     answer,
//                 }
//             });
            
//         }}>Add problem</button>
        
//     </div>
// }


import { useState } from "react"
export const CreateProblem=({socket,roomId}: {socket:any; roomId:string;})=>{

    const [title,setTitle]= useState("");
    const [description,setDescription] = useState("")
    const [answer,setAnswer]= useState(0)
    const [options,setOptions] = useState([
        {id:0, title:""},
        {id:1, title:""},
        {id:2, title:""},
        {id:3, title:""}
    ])
    return (
         <div className="flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">Create problem</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        onChange={(e)=>{
                            setTitle(e.target.value)
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-500 mb-1">Description</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        onChange={(e)=>{
                            setDescription(e.target.value)
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-500">Options</label>
                    {[0, 1, 2, 3].map(optionId => (
                        <div key={optionId} className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-gray-50">
                            <input
                                type="radio"
                                checked={optionId === answer}
                                onChange={() => {
                                    setAnswer(optionId)
                                }}
                                className="accent-purple-600 w-4 h-4 shrink-0"
                            />
                            <span className="text-sm text-gray-500 w-16 shrink-0">Option {optionId}</span>
                            <input
                                type="text"
                                className="flex-1 p-2 rounded-lg bg-white text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                onChange={(e) => {
                                    setOptions(options => options.map(x => {
                                        if (x.id === optionId) {
                                            return {
                                                ...x,
                                                title: e.target.value
                                            }
                                        }
                                        return x;
                                    }))
                                }}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="w-full mt-2 py-3 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99]"
                    onClick={() => {
                        socket.emit("createProblem", {
                            roomId,
                            problem:{
                                title,
                                description,
                                options,
                                answer,
                            }
                        });

                    }}
                >
                    Add problem
                </button>
            </div>
        </div>
        </div>
    )
}