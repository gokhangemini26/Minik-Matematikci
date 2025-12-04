
import React from 'react';
import { playClick } from '../../utils/SoundManager';

const VirtualKeypad = ({ onInput, onDelete, onSubmit }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const handlePress = (val) => {
        playClick();
        onInput(val);
    };

    const handleDelete = () => {
        playClick();
        onDelete();
    };

    const handleSubmit = () => {
        playClick();
        onSubmit();
    };

    return (
        <div className="grid grid-cols-3 gap-1 p-2 bg-white/50 rounded-xl border-2 border-blue-100 shadow-lg max-w-[180px]">
            {numbers.map((num) => (
                <button
                    key={num}
                    onClick={() => handlePress(num)}
                    className="w-10 h-10 text-xl font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-blue-50 active:scale-95 transition-all border-b-2 border-blue-200"
                >
                    {num}
                </button>
            ))}

            <button
                onClick={handleDelete}
                className="w-10 h-10 text-lg font-bold text-red-500 bg-white rounded-lg shadow-sm hover:bg-red-50 active:scale-95 transition-all border-b-2 border-red-200 flex items-center justify-center"
            >
                ⌫
            </button>

            <button
                onClick={() => handlePress(0)}
                className="w-10 h-10 text-xl font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-blue-50 active:scale-95 transition-all border-b-2 border-blue-200"
            >
                0
            </button>

            <button
                onClick={handleSubmit}
                className="w-10 h-10 text-lg font-bold text-green-500 bg-white rounded-lg shadow-sm hover:bg-green-50 active:scale-95 transition-all border-b-2 border-green-200 flex items-center justify-center"
            >
                ✓
            </button>
        </div>
    );
};

export default VirtualKeypad;
