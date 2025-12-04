
import React, { useEffect, useState } from 'react';

const TenFrame = ({ count, object, isSecondGroup = false, startIndex = 0, totalVisible, isHidden }) => {
    const slots = Array.from({ length: 10 });

    return (
        // Removed fixed height h-[70px], added h-auto. Kept w-[70px].
        <div className={`grid grid-cols-2 gap-0.5 p-1 rounded-md border-2 ${isSecondGroup ? 'bg-pink-50 border-pink-200' : 'bg-blue-50 border-blue-200'} shadow-sm w-[70px] h-auto transition-all duration-1000 ${isHidden ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            {slots.map((_, i) => {
                const itemIndex = startIndex + i;
                const isFilled = i < count;

                let showItem = isFilled;
                if (isSecondGroup) {
                    if (totalVisible !== undefined) {
                        showItem = isFilled && (totalVisible > itemIndex);
                    } else {
                        showItem = isFilled;
                    }
                } else {
                    showItem = isFilled;
                }

                return (
                    <div key={i} className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded bg-white relative overflow-hidden">
                        {showItem && (
                            <div className={`text-sm transition-all duration-500 ${isHidden ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-bounce-gentle'}`}>
                                {object.emoji}
                            </div>
                        )}
                        {isHidden && isFilled && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-bold">
                                ?
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MultiTenFrame = ({ count, object, isSecondGroup, startIndex = 0, totalVisible, isHidden }) => {
    const frameCount = Math.max(1, Math.ceil(count / 10));
    return (
        // Increased gap to gap-2 for better separation and allowed vertical scroll if absolutely needed (though unlikely with wrapping)
        <div className="flex flex-row flex-wrap gap-2 justify-center content-start h-full overflow-y-auto custom-scrollbar">
            {Array.from({ length: frameCount }).map((_, i) => {
                const countInFrame = Math.min(10, Math.max(0, count - i * 10));
                const frameStartIndex = startIndex + (i * 10);

                return (
                    <TenFrame
                        key={i}
                        count={countInFrame}
                        object={object}
                        isSecondGroup={isSecondGroup}
                        startIndex={frameStartIndex}
                        totalVisible={totalVisible}
                        isHidden={isHidden}
                    />
                );
            })}
        </div>
    );
};

const Visualizer = ({ problem, stage, isMentalMath }) => {
    const { num1, num2, type, object } = problem;
    const [visibleCount, setVisibleCount] = useState(0);
    const [hideItems, setHideItems] = useState(false);

    useEffect(() => {
        // Start counting from num1 so the second group starts animating immediately
        const startCount = type === 'addition' ? num1 : 0;
        setVisibleCount(startCount);
        setHideItems(false);

        if (type === 'addition') {
            const target = num1 + num2;
            const timer = setInterval(() => {
                setVisibleCount(prev => {
                    if (prev < target) return prev + 1;
                    clearInterval(timer);
                    return prev;
                });
            }, 200);
            return () => clearInterval(timer);
        }
    }, [problem, type, num1, num2]);

    useEffect(() => {
        if (isMentalMath && stage === 'WAITING_FOR_ANSWER') {
            const timer = setTimeout(() => {
                setHideItems(true);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setHideItems(false);
        }
    }, [isMentalMath, stage, problem]);

    return (
        <div className="flex flex-col w-full h-full max-h-[80vh]">
            {/* Main 3-Column Layout */}
            <div className="flex-1 grid grid-cols-12 gap-2 p-2 min-h-0">

                {/* LEFT COLUMN: Num1 (40%) */}
                <div className="col-span-5 flex flex-col items-center bg-blue-50/30 rounded-xl p-2 border border-blue-100 min-h-0 overflow-hidden">
                    <span className="text-blue-500 font-black text-xl mb-2">1. Sayı: {num1}</span>
                    <MultiTenFrame count={num1} object={object} isHidden={hideItems} />
                </div>

                {/* MIDDLE COLUMN: Operator (16%) - Narrow */}
                <div className="col-span-2 flex items-center justify-center">
                    <div className="text-6xl text-gray-300 font-black">
                        {type === 'addition' ? '+' : '-'}
                    </div>
                </div>

                {/* RIGHT COLUMN: Num2 (40%) */}
                <div className="col-span-5 flex flex-col items-center bg-pink-50/30 rounded-xl p-2 border border-pink-100 min-h-0 overflow-hidden">
                    <span className="text-pink-500 font-black text-xl mb-2">2. Sayı: {num2}</span>
                    {type === 'addition' ? (
                        <MultiTenFrame
                            count={num2}
                            object={object}
                            isSecondGroup={true}
                            startIndex={num1}
                            totalVisible={visibleCount}
                            isHidden={hideItems}
                        />
                    ) : (
                        <MultiTenFrame count={num2} object={object} isSecondGroup={true} isHidden={hideItems} />
                    )}
                </div>
            </div>

            {/* BOTTOM ROW: Result Placeholder */}
            <div className="h-20 flex items-center justify-center gap-4 mt-2">
                <div className="text-4xl text-gray-300 font-black">=</div>
                <div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-3xl text-gray-300 font-bold">
                    ?
                </div>
            </div>

            {/* Mental Math & Subtraction Hints */}
            <div className="h-6 flex items-center justify-center">
                {hideItems && (
                    <div className="text-purple-500 font-bold animate-pulse text-xs">
                        🙈 Zihinden Hesapla! Görselleri kaldırdım :)
                    </div>
                )}
                {type === 'subtraction' && !hideItems && (
                    <div className="text-gray-400 italic text-[10px]">
                        (Toplam {num1} taneden {num2} tanesi çıkıyor)
                    </div>
                )}
            </div>
        </div>
    );
};

export default Visualizer;
