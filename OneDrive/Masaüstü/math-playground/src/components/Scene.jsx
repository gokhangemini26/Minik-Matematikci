import React from 'react';
import { Physics, usePlane } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';

const Floor = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }));
    return (
        <group>
            <mesh ref={ref} receiveShadow>
                <planeGeometry args={[30, 20]} />
                <meshStandardMaterial color="#4ade80" /> {/* Grass Green */}
            </mesh>
            {/* Divider Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[0.2, 20]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Left Zone Label */}
            <Text position={[-8, 0.1, -5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2} color="white" fillOpacity={0.5}>
                LEFT FARM
            </Text>
            {/* Right Zone Label */}
            <Text position={[8, 0.1, -5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2} color="white" fillOpacity={0.5}>
                RIGHT FARM
            </Text>
        </group>
    );
};

const Wall = ({ position, rotation, args }) => {
    const [ref] = usePlane(() => ({ position, rotation }));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={args} />
            <meshStandardMaterial color="#86efac" transparent opacity={0.3} />
        </mesh>
    );
}

const Scene = ({ children }) => {
    return (
        <Canvas shadows camera={{ position: [0, 15, 15], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <spotLight position={[0, 20, 10]} angle={0.5} penumbra={1} castShadow intensity={1.2} />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#fef08a" />
            <pointLight position={[10, 5, -10]} intensity={0.5} color="#fef08a" />

            <Physics gravity={[0, -9.8, 0]}>
                <Floor />
                {/* Walls to keep sheep in */}
                <Wall position={[0, 5, -10]} rotation={[0, 0, 0]} args={[30, 10]} /> {/* Back */}
                <Wall position={[0, 5, 10]} rotation={[0, -Math.PI, 0]} args={[30, 10]} /> {/* Front */}
                <Wall position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]} args={[20, 10]} /> {/* Left */}
                <Wall position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]} args={[20, 10]} /> {/* Right */}

                {children}
            </Physics>

            {/* Fixed Camera - No OrbitControls by default, or very limited */}
            {/* <OrbitControls enableRotate={false} enableZoom={true} /> */}

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
        </Canvas>
    );
};

export default Scene;
