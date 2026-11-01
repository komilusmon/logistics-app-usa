import React, { useState, useEffect } from 'react';
import { US_STATES } from '../data/states';
import { StateData } from '../types/state';
import { Trophy, Flame, RefreshCw, CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';

export const DispatcherQuiz: React.FC<{ onInspectState?: (state: StateData) => void }> = ({ onInspectState }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate question state
  const [currentQuestion, setCurrentQuestion] = useState<{
    targetState: StateData;
    options: string[];
    correctAnswer: string;
    type: 'code_to_name' | 'name_to_code';
  } | null>(null);

  const generateNewQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    const randomIndex = Math.floor(Math.random() * US_STATES.length);
    const target = US_STATES[randomIndex];
    const isCodeToName = Math.random() > 0.5;

    // Pick 3 random wrong options
    const wrongStates = US_STATES.filter(s => s.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (isCodeToName) {
      const options = [target.name, ...wrongStates.map(s => s.name)].sort(() => 0.5 - Math.random());
      setCurrentQuestion({
        targetState: target,
        options,
        correctAnswer: target.name,
        type: 'code_to_name',
      });
    } else {
      const options = [target.id, ...wrongStates.map(s => s.id)].sort(() => 0.5 - Math.random());
      setCurrentQuestion({
        targetState: target,
        options,
        correctAnswer: target.id,
        type: 'name_to_code',
      });
    }
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(st => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIdx(i => i + 1);
    generateNewQuestion();
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setCurrentQuestionIdx(0);
    generateNewQuestion();
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Banner with Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Dispetcher Qisqartmalar Mashqi (Quiz)
          </h3>
          <p className="text-xs text-slate-400">
            AQSh shtatlari kodlarini tezkor yodlash va xatoliksiz tanish mashg'uloti
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ball: {score}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-orange-400">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>Ketma-ket: {streak}</span>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Qayta boshlash"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Box */}
      <div className="my-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-center max-w-xl mx-auto">
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 uppercase">
          Savol #{currentQuestionIdx + 1}
        </span>

        {currentQuestion.type === 'code_to_name' ? (
          <div className="mt-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Quyidagi qisqartma qaysi shtatga tegishli?
            </div>
            <div className="text-5xl sm:text-6xl font-mono font-black text-amber-400 mt-2 tracking-wider">
              {currentQuestion.targetState.id}
            </div>
            {currentQuestion.targetState.aliases && (
              <div className="text-xs text-slate-500 font-mono mt-1">
                (alias: {currentQuestion.targetState.aliases.join(', ')})
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Ushbu shtatning rasmiy qisqartmasi nima?
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              {currentQuestion.targetState.name}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Poytaxti: {currentQuestion.targetState.capital}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === currentQuestion.correctAnswer;

            let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`py-3.5 px-4 rounded-xl border text-base font-bold transition-all flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Answer explanation and Next button */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left text-xs sm:text-sm">
              <span className="font-bold text-slate-300">
                To'g'ri javob:{' '}
                <strong className="text-amber-400 font-mono text-base">
                  {currentQuestion.targetState.id} = {currentQuestion.targetState.name}
                </strong>
              </span>
              <p className="text-slate-400 text-xs mt-0.5">
                Vaqt: {currentQuestion.targetState.timeZoneName.split('/')[0]} • Magistrallar: {currentQuestion.targetState.interstates.slice(0, 3).join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onInspectState && (
                <button
                  type="button"
                  onClick={() => onInspectState(currentQuestion.targetState)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Xaritada ko'rish
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                Keyingisi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
