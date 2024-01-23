import React, { useEffect, useState, MutableRefObject, FC } from 'react';
import { useFrame } from '@react-three/fiber';
import CameraControlsImpl from 'camera-controls';
import { TimedAnimationConfig, useAnimatedCameraMove } from './useAnimatedCameraMove';
import { AnimationConfig, config } from 'react-spring';
import { Vector3 } from 'three';

interface AutoMoveCameraProps {
  controls: MutableRefObject<CameraControlsImpl | undefined>;
  inactivityTime?: number; // in frames
  animationConfig?: AnimationConfig;
}

const AutoMoveCamera: FC<AutoMoveCameraProps> = ({
  controls,
  inactivityTime = 60, // Default to 60 frames (approx 1 second at 60fps)
}) => {
  const [frameCount, setFrameCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const animationConfig :TimedAnimationConfig = { mass: 1, ...config.default, duration : 1 };

  const {isRunning ,prepareLerp, runSpring} = useAnimatedCameraMove(controls, animationConfig);

  const resetInactivityTimer = () => {
    setIsUserActive(true);
    setFrameCount(0);
  };

  useEffect(() => {
    const control = controls.current;
    control?.addEventListener('controlstart', resetInactivityTimer);
    control?.addEventListener('controlend', resetInactivityTimer);

    return () => {
      control?.removeEventListener('controlstart', resetInactivityTimer);
      control?.removeEventListener('controlend', resetInactivityTimer);
    };
  }, [controls]);

  useFrame(() => {
    if (isUserActive) {
      setFrameCount(frameCount + 1);
      if (frameCount > inactivityTime) {
        setIsUserActive(false);
      }
    }
  });

  const setNewTarget = () => {
    if (!isUserActive && !isRunning) {
      const radius = 7;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const newPos = new Vector3().setFromSphericalCoords(radius, phi, theta)

      const targetRadius = Math.random() * radius;
      const targetTheta = Math.random() * 2 * Math.PI;
      const targetPhi = Math.acos(2 * Math.random() - 1);

      const newTarget = new Vector3().setFromSphericalCoords(targetRadius, targetPhi, targetTheta).toArray();
      console.log(newPos)
      prepareLerp(newPos.toArray(), newTarget, 5);
    }
  }

  useEffect(() => {
    console.log(isRunning)
    setNewTarget();
    if(!isRunning && !isUserActive){
        runSpring();
    }
  }, [isUserActive, isRunning, prepareLerp]);

  // Render logic or additional JSX if needed
  return null; // or return JSX
};

export default AutoMoveCamera;
