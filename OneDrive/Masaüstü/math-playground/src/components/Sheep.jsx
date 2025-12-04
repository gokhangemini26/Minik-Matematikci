import React, { useState, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

const SheepVisual = ({ type }) => {
    if (type === 'ten') {
        return (
            <group>
                {/* Pen/Flock Visual */}
                <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.2, 0.1, 1.2]} />
                    <meshStandardMaterial color="#854d0e" /> {/* Wood Pen Floor */}
                </mesh>
                {/* Fences */}
                <mesh position={[0.55, 0, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.5, 1.2]} />
                    <meshStandardMaterial color="#a16207" />
                </mesh>
                <mesh position={[-0.55, 0, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.5, 1.2]} />
                    <meshStandardMaterial color="#a16207" />
                </mesh>
                <mesh position={[0, 0, 0.55]} castShadow>
                    <boxGeometry args={[1.2, 0.5, 0.1]} />
                    <meshStandardMaterial color="#a16207" />
                </mesh>
                <mesh position={[0, 0, -0.55]} castShadow>
                    <boxGeometry args={[1.2, 0.5, 0.1]} />
                    <meshStandardMaterial color="#a16207" />
                </mesh>

                {/* A group of small sheep inside */}
                <group scale={0.3} position={[-0.5, 0, -0.5]}>
                    <SheepVisual type="one" />
                </group>
                <group scale={0.3} position={[0.5, 0, 0.5]}>
                    <SheepVisual type="one" />
                </group>
                <group scale={0.3} position={[-0.5, 0, 0.5]}>
                    <SheepVisual type="one" />
                </group>
                <group scale={0.3} position={[0.5, 0, -0.5]}>
                    <SheepVisual type="one" />
                </group>
                <group scale={0.3} position={[0, 0, 0]}>
                    <SheepVisual type="one" />
                </group>
            </group>
        );
    }

    // Single Sheep Visual
    return (
        <group>
            {/* Body */}
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.6, 0.4, 0.8]} />
                <meshStandardMaterial color="#ffffff" /> {/* White Wool */}
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.3, 0.3]} castShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#171717" /> {/* Black Face */}
            </mesh>
            {/* Legs */}
            <mesh position={[-0.2, -0.3, 0.2]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.1]} />
                <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh position={[0.2, -0.3, 0.2]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.1]} />
                <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh position={[-0.2, -0.3, -0.2]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.1]} />
                <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh position={[0.2, -0.3, -0.2]} castShadow>
                <boxGeometry args={[0.1, 0.3, 0.1]} />
                <meshStandardMaterial color="#171717" />
            </mesh>
        </group>
    );
};

const Sheep = ({ position, type = 'one', onRegister }) => {
    const { size, viewport } = useThree();

    // Dimensions based on type
    const args = type === 'ten' ? [1.2, 0.5, 1.2] : [0.6, 0.6, 0.8];
    const mass = type === 'ten' ? 5 : 1;

    const [ref, api] = useBox(() => ({
        mass,
        position,
        args,
        linearDamping: 0.5,
        angularDamping: 0.5,
        fixedRotation: true, // Keep sheep upright mostly
    }));

    useEffect(() => {
        if (onRegister) {
            onRegister({ id: ref.current.uuid, api, ref, type });
        }
    }, [onRegister, api, ref, type]);

    const [isDragging, setIsDragging] = useState(false);

    const bind = useDrag(
        ({ active, event }) => {
            if (active) {
                event.stopPropagation();
                setIsDragging(true);
                api.mass.set(0);
                api.velocity.set(0, 0, 0);
                api.angularVelocity.set(0, 0, 0);
            } else {
                setIsDragging(false);
                api.mass.set(mass);
            }
        },
        { pointerEvents: true }
    );

    useFrame(({ camera, mouse }) => {
        if (isDragging) {
            // Raycast to a plane at y=2
            const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const distance = (2 - camera.position.y) / dir.y;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            api.position.set(pos.x, pos.y, pos.z);
            api.velocity.set(0, 0, 0);
            api.rotation.set(0, 0, 0);
        }
    });

    return (
        <group ref={ref} {...bind()}>
            <SheepVisual type={type} />
            {/* Invisible collider mesh for raycasting if needed, or just rely on children */}
            <mesh visible={false}>
                <boxGeometry args={args} />
            </mesh>
        </group>
    );
};

export default Sheep;
