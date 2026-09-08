/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    RigidBodyProps
} from '@react-three/rapier';
import { RibbonGeometry } from './RibbonGeometry';
import * as THREE from 'three';

const cardGLB = '/card.glb';
const lanyard = '/lanyard.png';

export function resetLanyardAssets() {
    useGLTF.clear(cardGLB);
    useTexture.clear(lanyard);
    useTexture.clear('/ken_talk.JPG');
}

import './Lanyard.css';



interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
    active?: boolean;
    reducedMotion?: boolean;
    flipTrigger?: number;
    onFlipChange?: (flipping: boolean) => void;
    onReady?: () => void;
    onDrag?: (dragging: boolean) => void;
    onContextChange?: (lost: boolean) => void;
}

export default function Lanyard({
    position = [0, 0, 10],
    gravity = [0, -40, 0],
    fov = 20,
    transparent = true, active = true, reducedMotion = false, flipTrigger = 0, onReady, onDrag, onContextChange, onFlipChange
}: LanyardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = (): void => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="lanyard-wrapper">
            <Canvas
                camera={{ position, fov, near: 0.1, far: 40 }}
                frameloop={active ? "always" : "never"}
                dpr={[1, 1.5]}
                gl={{ alpha: transparent, antialias: true }}
                onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                <ContextLifecycle onChange={onContextChange} />
                <Suspense fallback={null}>
                <ambientLight intensity={Math.PI} />
                <Physics updatePriority={-1} paused={!active} gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} reducedMotion={reducedMotion} flipTrigger={flipTrigger} onReady={onReady} onDrag={onDrag} onFlipChange={onFlipChange} />
                </Physics>
                <Environment blur={0.75} resolution={128}>
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={10}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
                </Suspense>
            </Canvas>
        </div>
    );
}

// Keep the canvas mounted on context loss so Three.js can restore its resources.
function ContextLifecycle({ onChange }: { onChange?: (lost: boolean) => void }) {
    const { gl, invalidate } = useThree();
    useEffect(() => {
        const canvas = gl.domElement;
        const lost = (event: Event) => { event.preventDefault(); onChange?.(true); };
        const restored = () => { onChange?.(false); invalidate(); };
        canvas.addEventListener('webglcontextlost', lost);
        canvas.addEventListener('webglcontextrestored', restored);
        return () => {
            canvas.removeEventListener('webglcontextlost', lost);
            canvas.removeEventListener('webglcontextrestored', restored);
        };
    }, [gl, invalidate, onChange]);
    return null;
}

interface BandProps {
    isMobile?: boolean;
    reducedMotion: boolean;
    flipTrigger: number;
    onFlipChange?: (flipping: boolean) => void;
    onReady?: () => void;
    onDrag?: (dragging: boolean) => void;
}

function topYAtZ(camera: THREE.PerspectiveCamera, z = 0) {
    const dist = camera.position.z - z
    const vFov = THREE.MathUtils.degToRad(camera.fov)
    const visibleHeight = 2 * Math.tan(vFov / 2) * dist
    return visibleHeight / 2
}

function Band({ isMobile = false, reducedMotion, flipTrigger, onReady, onDrag, onFlipChange }: BandProps) {
    const { width, height } = useThree((state) => state.size);
    const ribbon = useMemo(() => new RibbonGeometry(), []);
    const fixedVisual = useRef<THREE.Group>(null);
    const j1Visual = useRef<THREE.Group>(null);
    const j2Visual = useRef<THREE.Group>(null);
    useEffect(() => () => ribbon.dispose(), [ribbon]);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);
    const cardVisual = useRef<THREE.Group>(null);
    const flipPivot = useRef<THREE.Group>(null);
    const lastFlipTrigger = useRef(0);
    const flipMotion = useRef<{ elapsed: number; from: number } | null>(null);

    // Keep scratch vectors in refs so they are never re-allocated per frame
    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps: any = {
        type: 'dynamic' as RigidBodyProps['type'],
        canSleep: true,
        colliders: false,
        angularDamping: 8,
        linearDamping: 8
    };

    const { nodes, materials } = useGLTF(cardGLB) as any;
    const texture = useTexture(lanyard);
    const customCardTexture = useTexture('/ken_talk.JPG');

    customCardTexture.flipY = false;
    customCardTexture.wrapS = THREE.ClampToEdgeWrapping;
    customCardTexture.wrapT = THREE.ClampToEdgeWrapping;
    customCardTexture.repeat.set(0.8, 0.8);
    customCardTexture.offset.set(0.1, 0.1);
    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const [dragged, drag] = useState<false | THREE.Vector3>(false);
    const [hovered, hover] = useState(false);

    const baseAnchor = useRef(new THREE.Vector3(0, 8, 0));
    const { gl } = useThree();

    const { camera } = useThree()
    const topY = topYAtZ(camera as THREE.PerspectiveCamera, 0) + 0.2
    const anchorY = topY; // spawn baseline
    // Local mesh coordinates: behind the top of the metal ring, not through it.
    const cardLocalAttach = useMemo(() => new THREE.Vector3(0, 1.215, -0.045), []);
    const cardAttachWorld = useMemo(() => new THREE.Vector3(), []);
    const tmpVec = useMemo(() => new THREE.Vector3(), []);



    const segmentLength = 0.3;
    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segmentLength]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segmentLength]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segmentLength]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.5, 0]
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => {
                document.body.style.cursor = 'auto';
            };
        }
    }, [hovered, dragged]);

    useEffect(() => { onReady?.(); }, [onReady]);
    useEffect(() => {
        if (!flipTrigger || flipTrigger === lastFlipTrigger.current || !flipPivot.current) return;
        lastFlipTrigger.current = flipTrigger;
        if (reducedMotion) {
            flipPivot.current.rotation.y = (flipPivot.current.rotation.y + Math.PI) % (Math.PI * 2);
            return;
        }
        flipMotion.current = { elapsed: 0, from: flipPivot.current.rotation.y };
        onFlipChange?.(true);
    }, [flipTrigger, reducedMotion, onFlipChange]);
    useEffect(() => {
        const release = () => { drag(false); onDrag?.(false); };
        window.addEventListener('blur', release);
        window.addEventListener('pointerup', release);
        window.addEventListener('pointercancel', release);
        return () => { window.removeEventListener('blur', release); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); };
    }, [onDrag]);
    useFrame((state, delta) => {
        if (flipMotion.current && flipPivot.current) {
            const motion = flipMotion.current;
            motion.elapsed += Math.min(delta, 0.05);
            const progress = Math.min(motion.elapsed / 0.85, 1);
            const eased = progress * progress * (3 - 2 * progress);
            flipPivot.current.rotation.y = motion.from + Math.PI * eased;
            if (progress === 1) {
                flipPivot.current.rotation.y = (motion.from + Math.PI) % (Math.PI * 2);
                flipMotion.current = null;
                onFlipChange?.(false);
            }
        }
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.copy(state.camera.position).add(dir.multiplyScalar(-state.camera.position.z / dir.z));
            [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
            vec.sub(dragged);
            const halfWidth = topYAtZ(state.camera as THREE.PerspectiveCamera) * width / height;
            vec.x = THREE.MathUtils.clamp(vec.x, -Math.max(0.1, halfWidth - 0.9), Math.max(0.1, halfWidth - 0.9));
            vec.y = THREE.MathUtils.clamp(vec.y, -0.4, 1.0);
            card.current?.setNextKinematicTranslation(vec);
        }
        if (fixed.current) {
            if (!dragged) {
                tmpVec.set(
                    baseAnchor.current.x + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.08),
                    topY,
                    baseAnchor.current.z
                );
                fixed.current.setNextKinematicTranslation(tmpVec);
            }
            // Match the interpolated transform actually drawn by Rapier this frame.
            // Reading raw physics translation here made the ribbon jitter against the clip.
            if (!cardVisual.current) return;
            cardVisual.current.updateWorldMatrix(true, false);
            cardAttachWorld.copy(cardLocalAttach).applyMatrix4(cardVisual.current.matrixWorld);
            if (!fixedVisual.current || !j1Visual.current || !j2Visual.current) return;
            fixedVisual.current.getWorldPosition(curve.points[0]);
            j1Visual.current.getWorldPosition(curve.points[1]);
            j2Visual.current.getWorldPosition(curve.points[2]);
            curve.points[3].copy(cardAttachWorld);
            ribbon.update(curve);
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            ang.y -= rot.y * 0.25;
            card.current.setAngvel(ang);
        }
    });

    curve.curveType = 'centripetal';
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();

    return (
        <>
            <RigidBody ref={fixed} position={[0, anchorY, 0]} type={'kinematicPosition' as RigidBodyProps['type']}><group ref={fixedVisual} /></RigidBody>
            <RigidBody position={[0, anchorY - segmentLength, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}><group ref={j1Visual} />
                <BallCollider args={[0.1]} />
            </RigidBody>
            <RigidBody position={[0, anchorY - segmentLength * 2, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}><group ref={j2Visual} />
                <BallCollider args={[0.1]} />
            </RigidBody>
            <RigidBody position={[0, anchorY - segmentLength * 3, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                <BallCollider args={[0.1]} />
            </RigidBody>
            <RigidBody
                position={[0, anchorY - segmentLength * 3 - 1.45, 0]}
                ref={card}
                {...segmentProps}
                type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
            >
                <CuboidCollider args={[0.8, 1.125, 0.01]} />
                <group ref={flipPivot}>
                <group
                    ref={cardVisual}
                    scale={2.25}
                    position={[0, -1.2, -0.05]}
                    onPointerOver={() => hover(true)}
                    onPointerOut={() => hover(false)}
                    onPointerCancel={() => { drag(false); onDrag?.(false); }}
                    onLostPointerCapture={() => { drag(false); onDrag?.(false); }}
                    onPointerUp={(e: any) => {
                        e.target.releasePointerCapture(e.pointerId);
                        drag(false);
                        onDrag?.(false);
                    }}
                    onPointerDown={(e: any) => {
                        if (e.button !== 0 || flipMotion.current) return;
                        e.stopPropagation();
                        e.target.setPointerCapture(e.pointerId);
                        onDrag?.(true);
                        drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                    }}
                >
                    <mesh geometry={nodes.card.geometry}>
                        <meshPhysicalMaterial
                            map={customCardTexture}
                            map-anisotropy={16}
                            clearcoat={isMobile ? 0 : 1}
                            clearcoatRoughness={0.15}
                            roughness={0.9}
                            metalness={0.8}
                        />
                    </mesh>
                    <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                    <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

                </group>
                </group>
            </RigidBody>
            <mesh geometry={ribbon} frustumCulled={false}>
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </>
    );
}
