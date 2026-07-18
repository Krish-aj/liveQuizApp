import { useState } from 'react';

export function Quiz({quizData, socket, userId, problemId, roomId}: {
    quizData: {
        title: string;
        options: {id: number, title: string}[];
    },
    socket: any;
    roomId: string;
    userId: string;
    problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission , setSubmission] = useState(0);

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md bg-panel/60 backdrop-blur-md ring-1 ring-white/10 rounded-2xl shadow-lg shadow-black/40 p-6">
            <SingleQuiz
                choices={quizData.options}
                title={quizData.title}
                imageURL={""}
                setSelected={setSubmission}
            />
          <div className="flex justify-center w-full mt-6">
            <button
              className="py-3 px-10 rounded-xl font-display font-bold bg-violet text-black shadow-md shadow-violet/30 transition hover:bg-[#8f74ff] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              disabled={submitted}
              onClick={() => {
                setSubmitted(true);
                socket.emit("submit", {
                    userId,
                    problemId,
                    submission: Number(submission),
                    roomId,
                })
              }}
            >
              {submitted ? "Submitted" : "Submit"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: {id: number, title: string}[];
  imageURL?: string;
  setSelected: any;
};

function SingleQuiz({
  title,
  choices,
  imageURL,
  setSelected
}: SingleQuizProps) {
  return (
   <article>
      <h4 className="mt-10 text-xl font-display font-bold text-amber uppercase tracking-[0.2em] text-sm">
        Question
      </h4>
      <div className="mt-4 text-2xl font-medium text-white/90">{title}</div>
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length > 0 &&
        choices.map((choice) => {
         return (
            <div
              key={choice.id}
              className="flex items-center w-full py-4 pl-5 m-2 ml-0 space-x-2 border-2 cursor-pointer rounded-xl transition-colors border-white/10 bg-white/5 hover:border-white/20"
            > 
              <input
                type="radio"
                name="option"
                value={choice.id}
                className="w-5 h-5 accent-violet"
                onClick={() => {
                    setSelected(choice.id)
                }}
              />
              <p className="ml-6 text-white/90">{choice.title}</p>
            </div>
          );
        })}
      <div className="flex flex-col items-start w-full"></div>
    </article>
  );
}