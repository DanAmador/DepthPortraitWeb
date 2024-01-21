import { useSpring } from '@react-spring/core';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useState } from 'react';
import * as THREE from 'three';
import CameraControlsImpl from 'camera-controls';

export const useAnimatedCameraMove = (controls: MutableRefObject<CameraControlsImpl>) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startPosition, setStartPosition] = useState<[number, number, number]>();
  const [startTarget, setStartTarget] = useState<[number, number, number]>();
  const [endPosition, setEndPosition] = useState<[number, number, number]>();
  const [endTarget, setEndTarget] = useState<[number, number, number]>();

  const [spring, api] = useSpring(() => ({
    t: 0,
    config: { mass: 1, tension: 170, friction: 26 },
    reset: true,
  }));

  const runSpring = () => {
    if (!isRunning) {
      setIsRunning(true);
      api.start({
        from: { t: 0 },
        to: { t: 1 },
      });
    }
  };

  const setVariables = (posB: [number, number, number] = [0, 2, 5], tgtB: [number, number, number] = [-1, 0, 0]) => {
    console.log(controls)
    if (controls?.current instanceof CameraControlsImpl) {
      console.log(posB, tgtB);
        const tempVector = new THREE.Vector3();
      const posA = controls.current.getPosition(tempVector).toArray();
      const tgtA = controls.current.getTarget(tempVector).toArray();
      setStartPosition(posA);
      setStartTarget(tgtA);
      setEndPosition(posB);
      setEndTarget(tgtB);
      runSpring();
    }
  };

  useFrame(() => {
    if (!isRunning || !controls.current) return;

    if (startPosition && startTarget && endPosition && endTarget) {
      const t = spring.t.get();
      void controls.current.lerpLookAt(
        ...startPosition,
        ...startTarget,
        ...endPosition,
        ...endTarget,
        t,
        true
      );

      // Optionally, stop the animation when t reaches 1
      if (t === 1) {
        setIsRunning(false);
      }
    }
  });

  return { setVariables, isRunning, runSpring };
};
