import { useState } from "react";
import type { TemplateQuestion } from "../../types/template";
import { apiFetch } from "../../lib/api";

const emptyQuestion=(): TemplateQuestion=>({
    title:"",
    description:"",
    answer:0,
    options:[0,1,2,3].map((id)=>({id,title:""})),
});


export function TemplateBuilder({
    token,
    onSaved,
    onCancle,
}: {
    token:string;
    onSaved:()=>void;
    onCancle:()=>void;
}) {
    const [templateName,setTemplateName]=useState("");
    const [questions,setQuestions]=useState<TemplateQuestion[]>([emptyQuestion()]);
    const [saving,setSaving]=useState(false);
    const [error,setError]=useState<string|null>(null); 

    function updateQuestion(index:number,patch:Partial<TemplateQuestion>){
        setQuestions((qs)=>qs.map((q,i)=> (i === index ? {...q, ...patch}: q)));
    }

    function updateOption(qIndex:number,optionId:number,title:string){
        setQuestions((qs)=>
            qs.map((q,i)=>
                i===qIndex
                    ?{...q,options: q.options.map((o) =>
                        (o.id===optionId ?{...o,title}:o )) } :q
            )
        );
    }

    function addQuestion(){
        setQuestions((qs)=>[...qs,emptyQuestion()])
    }

    function removeQuestion(index:number){
        setQuestions((qs)=>qs.filter((_,i)=> i!==index))
    }

    const isValid=
        templateName.trim().length >0 &&
        questions.length >0 &&
        questions.every((q)=>q.title.trim() && q.options.every((o)=> o.title.trim()))

    async function handleSave(){
        if(!isValid) return;
        setSaving(true);
        setError(null);
        
        try {
            await apiFetch("/templates",token,{
                method:"POST",
                body:JSON.stringify({name:templateName.trim(),questions}),
            })
            onSaved();
        } catch (err) {
            setError(err instanceof Error? err.message: "failed saving template")
        }finally{
            setSaving(false);
        }
    }


    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">New template</h2>
        <button onClick={onCancle} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Template name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="e.g. General Knowledge Round 1"
          className="w-full p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
      </div>

      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Question {qIndex + 1}</span>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(qIndex)} className="text-sm text-rose-500 hover:text-rose-600">
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              value={q.title}
              onChange={(e) => updateQuestion(qIndex, { title: e.target.value })}
              placeholder="Question title"
              className="w-full p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <input
              type="text"
              value={q.description}
              onChange={(e) => updateQuestion(qIndex, { description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full p-3 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />

            <div className="space-y-2">
              {q.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-gray-50">
                  <input
                    type="radio"
                    checked={q.answer === opt.id}
                    onChange={() => updateQuestion(qIndex, { answer: opt.id as 0 | 1 | 2 | 3 })}
                    className="accent-purple-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm text-gray-500 w-16 shrink-0">Option {opt.id}</span>
                  <input
                    type="text"
                    value={opt.title}
                    onChange={(e) => updateOption(qIndex, opt.id, e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-white text-slate-900 placeholder-gray-400 border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="w-full py-2 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600 transition"
      >
        + Add another question
      </button>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={!isValid || saving}
        className="w-full py-3 rounded-xl font-medium bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save template"}
      </button>
    </div>
  );
}
    
    