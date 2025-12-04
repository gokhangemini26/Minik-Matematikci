import React, { useState, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

const DraggableBlock = ({ position, type = 'one', color, onRegister }) => {
    const { size, viewport } = useThree();

    // Dimensions based on type
    const args = type === 'ten' ? [0.5, 0.5, 5] : [0.5, 0.5, 0.5];
    const mass = type === 'ten' ? 2 : 1;

    // Default colors if not provided
    const defaultColor = type === 'ten' ? '#06b6d4' : '#facc15'; // Cyan for Tens, Yellow for Ones
    const finalColor = color || defaultColor;

    const [ref, api] = useBox(() => ({
        mass,
        position,
        args,
        linearDamping: 0.5,
        angularDamping: 0.5,
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
        <mesh
            ref={ref}
            {...bind()}
            onPointerDown={(e) => {
                e.stopPropagation();
                setIsDragging(true);
                api.mass.set(0);
                e.target.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                setIsDragging(false);
                api.mass.set(mass);
                e.target.releasePointerCapture(e.pointerId);
            }}
            castShadow
            receiveShadow
        >
            <boxGeometry args={args} />
            <meshStandardMaterial color={isDragging ? '#ef4444' : finalColor} roughness={0.4} metalness={0.1} />
        </mesh>
    );
};

export default DraggableBlock;
