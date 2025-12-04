
import React, { useEffect, useState, useRef } from 'react';

const TeacherAgent = ({ text, onComplete, isSpeaking }) => {
    const [speaking, setSpeaking] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!text) return;

        // TTS DISABLED: Only using silent timer for reading
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3000); // Allow 3 seconds to read the text

        return () => clearTimeout(timer);
    }, [text]);

    const handleAudioEnded = () => {
        setSpeaking(false);
        if (onComplete) onComplete();
    };

    return (
        <div className="flex flex-col items-center animate-fade-in">
            <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
            <div className={`w-32 h-32 rounded-full bg-white border-4 border-pink-300 shadow-lg flex items-center justify-center text-6xl mb-4 transition-transform duration-300 ${speaking ? 'scale-110' : 'scale-100'}`}>
                {speaking ? '😮' : '😊'}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-100 max-w-lg text-center relative">
                {/* Speech Bubble Triangle */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-t-2 border-l-2 border-blue-100 rotate-45"></div>

                <p className="text-2xl text-gray-700 font-medium leading-relaxed">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default TeacherAgent;
