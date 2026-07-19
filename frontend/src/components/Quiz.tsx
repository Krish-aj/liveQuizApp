import { useState, useEffect, useRef } from 'react';
const PROBLEM_TIME_S = 5;

export function Quiz({ quizData, socket, userId, problemId, roomId }: {
  quizData: {
    title: string;
    options: { id: number, title: string }[];
    startTime: number;
    answer: number;
  },
  socket: any;
  roomId: string;
  userId: string;
  problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - quizData.startTime) / 1000);
    return Math.max(0, PROBLEM_TIME_S - elapsed);
  });

  const submittedRef = useRef(false);
  const submissionRef = useRef<number | null>(null);

  useEffect(() => {
    submissionRef.current = submission;
  }, [submission])

  const doSubmit = (value: number) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true)
    socket.emit("submit", {
      userId,
      problemId,
      submission: Number(value), //type conver mismatch 
      roomId,
    })
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - quizData.startTime) / 1000);
      const remaining = Math.max(0, PROBLEM_TIME_S - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (!submittedRef.current) {
          const options = quizData.options;
          const randomChoice = options[Math.floor(Math.random() * options.length)];
          doSubmit(randomChoice ? randomChoice.id : 0);
        }
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeUp = timeLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex w-full justify-center">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg shadow-purple-100 border border-gray-100 p-6">
          <div className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${timeLeft <= 5 ? "bg-rose-100 text-rose-600" : "bg-purple-100 text-purple-600"
            }`}>
            {timeLeft}
          </div>
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}

            selected={submission}
            setSelected={setSubmission}
            disabled={submitted || timeUp}
            revealAnswer={timeUp}
            correctAnswer={quizData.answer}
          />
          <div className="flex justify-center w-full mt-6">
            <button
              className="w-full py-3 px-10 rounded-xl font-medium bg-purple-600 text-white shadow-sm hover:bg-purple-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              disabled={submitted || submission === null || timeUp}
              onClick={() => {
                if (submission !== null) doSubmit(submission);
              }}
            >
              {submitted ? "Submitted" : timeUp ? "Time's up" : "Submit"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: { id: number, title: string }[];
  selected: number | null
  setSelected: (id: number) => void;
  disabled?: boolean;
  revealAnswer: boolean;
  correctAnswer: number;
};

function SingleQuiz({
  title,
  choices,
  selected,
  setSelected,
  disabled,
  revealAnswer,
  correctAnswer,
}: SingleQuizProps) {
  return (
    <article>
      <h4 className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-2 pr-12">
        Question
      </h4>
      <div className="text-xl font-semibold text-slate-800 mb-4 pr-12">{title}</div>

      {choices.length > 0 &&
        choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrect = revealAnswer && choice.id === correctAnswer;
          const isWrong = revealAnswer && isSelected && choice.id !== correctAnswer;
          const userWasWrong = revealAnswer && selected !== correctAnswer;

          const colorClasses = isCorrect
            ? "border-emerald-500 bg-emerald-50"
            : isWrong
              ? "border-rose-500 bg-rose-50"
              : !revealAnswer && isSelected
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-gray-50 hover:border-purple-300";

          const dotClasses = isCorrect
            ? "border-emerald-600 bg-emerald-600"
            : isWrong
              ? "border-rose-500 bg-rose-500"
              : !revealAnswer && isSelected
                ? "border-purple-600 bg-purple-600"
                : "border-gray-300";

          const showDot = isCorrect || isWrong || (!revealAnswer && isSelected);
          const opacityClass = isCorrect && userWasWrong ? "opacity-45" : "opacity-100"

          return (
            <div
              key={choice.id}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onClick={() => { if (!disabled) setSelected(choice.id); }}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(choice.id);
                }
              }}
              className={`flex items-center w-full py-4 px-5 mb-2 space-x-3 border-2 rounded-xl transition-colors ${disabled ? "cursor-not-allowed" : "cursor-pointer"
                } ${colorClasses} ${opacityClass}`}
            >
              <span
                className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${dotClasses}`}
              >
                <span className={`h-2 w-2 rounded-full bg-white ${showDot ? "opacity-100" : "opacity-0"}`} />
              </span>
              <p className="text-slate-700">{choice.title}</p>
            </div>
          );
        })}
    </article>
  );
}