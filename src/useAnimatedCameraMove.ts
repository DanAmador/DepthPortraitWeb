import { useSpring, config } from '@react-spring/core';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef, useState } from 'react';
import * as THREE from 'three';
import CameraControlsImpl from 'camera-controls';
import { AnimationConfig } from 'react-spring';

export type TimedAnimationConfig = AnimationConfig & {
  duration?: number; // Optional duration
};

export const useAnimatedCameraMove = (
  controls: MutableRefObject<CameraControlsImpl | undefined>,
  animationConfig: TimedAnimationConfig = { ...config.molasses, duration: 3, mass: 300, } as TimedAnimationConfig
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startPosition, setStartPosition] = useState<[number, number, number]>();
  const [startTarget, setStartTarget] = useState<[number, number, number]>();
  const [endPosition, setEndPosition] = useState<[number, number, number]>();
  const [endTarget, setEndTarget] = useState<[number, number, number]>();
  const currentPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const [lerpDuration, setLerpDuration] = useState(animationConfig.duration);
  // Define the initial configuration for the spring

  const [spring, api] = useSpring(() => ({
    t: 0,
    config: { duration: animationConfig.duration },
    reset: true,
  }));

  const runSpring = () => {
    if (!isRunning) {
      setIsRunning(true);
      api.start({
        from: { t: 0 },
        to: { t: 1 },
        config: { duration: animationConfig.duration * 1000 },
        reset: true,
      });
    }
  };

  const prepareLerp = (posB: [number, number, number] = [0, 2, 5], tgtB: [number, number, number] = [-1, 0, 0], t = 1) => {
    if (controls?.current) {
      const tempVector = new THREE.Vector3();
      const posA = controls.current.getPosition(tempVector).toArray();
      const tgtA = controls.current.getTarget(tempVector).toArray();
      setStartPosition(posA);
      setStartTarget(tgtA);
      setEndPosition(posB);
      setEndTarget(tgtB);
      setLerpDuration(t);
      // Update spring configuration dynamically


      setIsRunning(false);
    }
  };

  useFrame(() => {
    if (!isRunning || !controls.current) return;
    if (startPosition && startTarget && endPosition && endTarget) {
      const t = spring.t.get();
      controls.current.camera.getWorldPosition(currentPosition.current);

      void controls.current.lerpLookAt(
        ...startPosition,
        ...startTarget,
        ...endPosition,
        ...endTarget,
        t,
        true
      );

      if (t === 1) {
        setIsRunning(false);
        //   api.start({
        //         config: {
        //             ...springConfig,
        //             duration: lerpDuration, // Update duration dynamically based on the new 't' value
        //         },
        //         from: { t: 0 },
        //         to: { t: lerpDuration },
        //         reset: true,
        //     });  
      }
    }
  });

  return { isRunning, prepareLerp, runSpring };
};
