import { useState } from "react";
import type { QuizTemplate } from "../../types/template";
import { apiFetch } from "../../lib/api";


 function generateRoomCode():string{
      const chars= "ABCD1234567890";
      return Array.from({length:4},()=>chars[Math.floor(Math.random()* chars.length)]).join("");
    }

    
export function TemplateList({
    token,
    templates,
    onCreateRoom,
    onDeleted,
    onNewTemplate,
}:{
    token:string;
    templates:QuizTemplate[];
    onCreateRoom:(templateId:string,roomId:string)=>void;
    onDeleted:(templateId:string)=>void;
    onNewTemplate:()=>void;
}) {
    const [openTemplateId,setOpenTemplateId]=useState<string|null>(null);
    const [roomId,setRoomId]=useState("");

   

    async function handleDelete(id:string){
        await apiFetch(`/templates/${id}`,token,{method:"DELETE"});
        onDeleted(id);
    }


     return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">Your templates</h2>
        <button onClick={onNewTemplate} className="text-sm font-medium text-purple-600 hover:text-purple-700">
          + New template
        </button>
      </div>

      {templates.length === 0 && (
        <p className="text-sm text-gray-500">No templates yet — create one to get started.</p>
      )}

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t._id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{t.name}</p>
                <p className="text-sm text-gray-500">{t.questions.length} question{t.questions.length === 1 ? "" : "s"}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenTemplateId(openTemplateId === t._id ? null : t._id)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  {openTemplateId === t._id ? "Cancel" : "Use template"}
                </button>
                <button onClick={() => handleDelete(t._id)} className="text-sm text-rose-500 hover:text-rose-600">
                  Delete
                </button>
              </div>
            </div>

            {openTemplateId === t._id && (
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Room ID"
                  className="flex-1 p-2 rounded-lg bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setRoomId(generateRoomCode())}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-purple-600 border border-purple-200 hover:bg-purple-50 transition"
                >
                  Generate
                </button>
                <button
                  onClick={() => roomId.trim() && onCreateRoom(t._id, roomId.trim())}
                  disabled={!roomId.trim()}
                  className="px-5 py-2 rounded-lg font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create room
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}