import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Sheep from './Sheep';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

const GameManager = () => {
    const [sheep, setSheep] = useState([]);
    const [leftCount, setLeftCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);
    const [isEqual, setIsEqual] = useState(false);

    const sheepRefs = useRef({});

    // Initial spawn
    useEffect(() => {
        spawnSheep();
    }, []);

    const spawnSheep = () => {
        const newSheep = [];
        sheepRefs.current = {}; // Clear refs

        // Spawn some random sheep on both sides
        // Left side (x < 0)
        for (let i = 0; i < 2; i++) {
            newSheep.push({ id: `ten-left-${i}`, type: 'ten', position: [-5 - Math.random() * 5, 5, (Math.random() - 0.5) * 5] });
        }
        for (let i = 0; i < 5; i++) {
            newSheep.push({ id: `one-left-${i}`, type: 'one', position: [-5 - Math.random() * 5, 5, (Math.random() - 0.5) * 5] });
        }

        // Right side (x > 0)
        for (let i = 0; i < 1; i++) {
            newSheep.push({ id: `ten-right-${i}`, type: 'ten', position: [5 + Math.random() * 5, 5, (Math.random() - 0.5) * 5] });
        }
        for (let i = 0; i < 8; i++) {
            newSheep.push({ id: `one-right-${i}`, type: 'one', position: [5 + Math.random() * 5, 5, (Math.random() - 0.5) * 5] });
        }

        setSheep(newSheep);
    };

    const handleRegister = (data) => {
        sheepRefs.current[data.id] = data;
    };

    const handleReset = () => {
        setSheep([]);
        setTimeout(spawnSheep, 100);
    };

    // Counting Logic
    useFrame(() => {
        let left = 0;
        let right = 0;

        Object.values(sheepRefs.current).forEach(({ ref, type }) => {
            if (ref.current) {
                const pos = ref.current.position;
                const value = type === 'ten' ? 10 : 1;

                if (pos.x < 0) {
                    left += value;
                } else {
                    right += value;
                }
            }
        });

        // Only update state if values changed to avoid re-renders
        if (left !== leftCount) setLeftCount(left);
        if (right !== rightCount) setRightCount(right);
        if ((left === right) !== isEqual) setIsEqual(left === right);
    });

    return (
        <>
            {/* 3D Equality Sign in the middle */}
            <Text position={[0, 2, -8]} fontSize={4} color={isEqual ? "#22c55e" : "#ef4444"}>
                {isEqual ? "=" : "≠"}
            </Text>

            {sheep.map((s) => (
                <Sheep
                    key={s.id}
                    position={s.position}
                    type={s.type}
                    onRegister={handleRegister}
                />
            ))}

            {/* UI Overlay */}
            <Html position={[0, 8, 0]} center>
                <div className="pointer-events-none w-[80vw] flex justify-between items-start">
                    {/* Left Score */}
                    <div className="bg-white/80 p-4 rounded-2xl border-4 border-green-400 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-green-700">LEFT FARM</h2>
                        <p className="text-6xl font-black text-green-600 text-center">{leftCount}</p>
                    </div>

                    {/* Center Status */}
                    <div className="mt-4">
                        {isEqual && (
                            <div className="bg-yellow-100 px-6 py-2 rounded-full border-4 border-yellow-400 animate-bounce">
                                <span className="text-2xl font-black text-yellow-600">EQUAL! 🎉</span>
                            </div>
                        )}
                    </div>

                    {/* Right Score */}
                    <div className="bg-white/80 p-4 rounded-2xl border-4 border-blue-400 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-blue-700">RIGHT FARM</h2>
                        <p className="text-6xl font-black text-blue-600 text-center">{rightCount}</p>
                    </div>
                </div>

                {/* Controls at bottom */}
                <div className="absolute top-[70vh] left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button onClick={handleReset} className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg text-xl">
                        RESET SHEEP
                    </button>
                </div>
            </Html>
        </>
    );
};

export default GameManager;
