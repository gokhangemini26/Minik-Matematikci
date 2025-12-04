
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateProblem, getExplanation, getHint } from '../../utils/StoryEngine';
import { playSuccess, playError, playClick } from '../../utils/SoundManager';
import Visualizer from './Visualizer';
import TeacherAgent from './TeacherAgent';
import VirtualKeypad from './VirtualKeypad';

const STAGES = {
    START: 'START',
    READING_STORY: 'READING_STORY',
    READING_QUESTION: 'READING_QUESTION',
    WAITING_FOR_ANSWER: 'WAITING_FOR_ANSWER',
    EVALUATING: 'EVALUATING',
    EXPLAINING: 'EXPLAINING'
};

const StoryApp = () => {
    const [stage, setStage] = useState(STAGES.START);
    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [agentText, setAgentText] = useState('');
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [isMentalMath, setIsMentalMath] = useState(false);

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem('mathHighScore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const playSound = (type) => {
        if (type === 'click') playClick();
        if (type === 'success') playSuccess();
        if (type === 'error') playError();
    };

    const startNewProblem = () => {
        playSound('click');
        const newProblem = generateProblem(difficulty);
        setProblem(newProblem);
        setStage(STAGES.READING_STORY);
        setAgentText(newProblem.storyText);
        setUserAnswer('');
        setFeedback('');
        setHintUsed(false);
    };

    const handleStoryRead = () => {
        if (stage === STAGES.READING_STORY) {
            setStage(STAGES.READING_QUESTION);
            setAgentText(problem.questionText);
        } else if (stage === STAGES.READING_QUESTION) {
            setStage(STAGES.WAITING_FOR_ANSWER);
        } else if (stage === STAGES.EVALUATING) {
            setStage(STAGES.EXPLAINING);
            setAgentText(getExplanation(problem));
        } else if (stage === STAGES.EXPLAINING) {
            // Ready for next
        }
    };

    const giveHint = () => {
        playSound('click');
        setHintUsed(true);
        setAgentText(getHint(problem));
    };

    const checkAnswer = () => {
        const num = parseInt(userAnswer);
        if (isNaN(num)) return;

        if (num === problem.answer) {
            playSound('success');

            const newStreak = streak + 1;
            setStreak(newStreak);

            // Update High Score
            if (newStreak > highScore) {
                setHighScore(newStreak);
                localStorage.setItem('mathHighScore', newStreak.toString());
            }

            // Milestone check
            if (newStreak % 5 === 0) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FFA500', '#FF4500']
                });
                setFeedback(`MÜKEMMEL! ${newStreak} TANE BİLDİN! 🏆`);
                setAgentText(`İnanılmazsın! Tam ${newStreak} soruyu doğru bildin! Sen bir matematik dehasısın!`);
            } else {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setFeedback('Harika! Doğru bildin! 🎉');
                setAgentText('Harikasın! Doğru Cevap!');
            }

            setStage(STAGES.EVALUATING);
        } else {
            playSound('error');
            setFeedback(`Hmm, tam olmadı. Cevap ${problem.answer} olmalıydı.`);
            setAgentText(`Üzgünüm, cevap ${problem.answer} olacaktı.`);
            setStreak(0);
            setStage(STAGES.EVALUATING);
        }
    };

    // Keypad handlers
    const handleKeypadInput = (val) => {
        if (userAnswer.length < 3) {
            setUserAnswer(prev => prev + val);
        }
    };

    const handleKeypadDelete = () => {
        setUserAnswer(prev => prev.slice(0, -1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col items-center p-4 md:p-8 font-sans">
            {/* Header */}
            <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-blue-400 tracking-wider">MİNİK MATEMATİKÇİ</h1>
                    <div className="flex gap-4 mt-2">
                        {streak > 0 && (
                            <div className="text-orange-400 font-bold text-lg animate-bounce-gentle">
                                🔥 {streak} Seri
                            </div>
                        )}
                        {highScore > 0 && (
                            <div className="text-purple-400 font-bold text-lg">
                                🏆 Rekor: {highScore}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 items-center">
                        {/* Difficulty Selector */}
                        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-blue-100">
                            <button
                                onClick={() => { playSound('click'); setDifficulty('easy'); }}
                                className={`px-3 py-1 rounded-lg font-bold text-sm transition-colors ${difficulty === 'easy' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                Kolay
                            </button>
                            <button
                                onClick={() => { playSound('click'); setDifficulty('hard'); }}
                                className={`px-3 py-1 rounded-lg font-bold text-sm transition-colors ${difficulty === 'hard' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                Zor
                            </button>
                        </div>

                        {stage !== STAGES.START && (
                            <button
                                onClick={startNewProblem}
                                className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-yellow-800 font-bold rounded-xl shadow-sm transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <span>🔄</span> <span className="hidden sm:inline">Yeni Soru</span>
                            </button>
                        )}
                    </div>

                    {/* Mental Math Toggle */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-purple-100 cursor-pointer" onClick={() => setIsMentalMath(!isMentalMath)}>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isMentalMath ? 'bg-purple-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isMentalMath ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-sm font-bold text-purple-500">🧠 Zihinden</span>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[95%] flex flex-col md:flex-row gap-8 items-start justify-center h-full">

                {stage === STAGES.START && (
                    <div className="w-full flex flex-col items-center justify-center h-96">
                        <button
                            onClick={startNewProblem}
                            className="px-12 py-6 bg-blue-400 hover:bg-blue-500 text-white text-2xl font-bold rounded-3xl shadow-xl transform transition hover:scale-105 active:scale-95"
                        >
                            Hikayeye Başla! 🚀
                        </button>
                    </div>
                )}

                {stage !== STAGES.START && problem && (
                    <>
                        {/* LEFT COLUMN: Visualizer (Larger space) */}
                        <div className="w-full md:w-2/3 flex flex-col items-center justify-center bg-white/30 rounded-3xl p-4 shadow-sm min-h-[500px]">
                            <h2 className="text-2xl font-bold text-blue-400 mb-6">Görselleştirme</h2>
                            <Visualizer problem={problem} stage={stage} isMentalMath={isMentalMath} />
                        </div>

                        {/* RIGHT COLUMN: Interaction (Smaller space) */}
                        <div className="w-full md:w-1/3 flex flex-col items-center gap-6">

                            {/* Teacher Area */}
                            <div className="w-full flex justify-center min-h-[150px]">
                                <TeacherAgent
                                    text={agentText}
                                    onComplete={handleStoryRead}
                                    isSpeaking={stage === STAGES.READING_STORY || stage === STAGES.READING_QUESTION || stage === STAGES.EVALUATING || stage === STAGES.EXPLAINING}
                                />
                            </div>

                            {/* Input & Keypad Area */}
                            {stage === STAGES.WAITING_FOR_ANSWER && (
                                <div className="flex flex-col items-center gap-6 animate-fade-in-up w-full">

                                    <div className="flex gap-4 items-center justify-center w-full">
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            className="w-24 h-16 text-center text-3xl font-bold border-4 border-blue-200 rounded-2xl focus:border-pink-300 focus:outline-none text-gray-700 bg-white"
                                            placeholder="?"
                                            readOnly
                                        />
                                        <button
                                            onClick={checkAnswer}
                                            className="px-6 py-4 bg-green-400 hover:bg-green-500 text-white text-lg font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
                                        >
                                            Cevapla
                                        </button>
                                    </div>

                                    {!hintUsed && (
                                        <button
                                            onClick={giveHint}
                                            className="text-blue-400 font-semibold hover:text-blue-600 underline text-sm"
                                        >
                                            💡 İpucu Al
                                        </button>
                                    )}

                                    {/* Virtual Keypad */}
                                    <div className="mt-2">
                                        <VirtualKeypad
                                            onInput={handleKeypadInput}
                                            onDelete={handleKeypadDelete}
                                            onSubmit={checkAnswer}
                                        />
                                    </div>
                                </div>
                            )}

                            {(stage === STAGES.EXPLAINING || (stage === STAGES.EVALUATING && !agentText)) && (
                                <div className="flex flex-col items-center gap-4 animate-fade-in">
                                    {stage === STAGES.EXPLAINING && (
                                        <button
                                            onClick={startNewProblem}
                                            className="px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
                                        >
                                            Sıradaki Hikaye ➡️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default StoryApp;
