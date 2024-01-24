import React, { useEffect, useState, MutableRefObject, FC } from 'react';
import { useFrame } from '@react-three/fiber';
import CameraControlsImpl from 'camera-controls';
import { TimedAnimationConfig, useAnimatedCameraMove } from './useAnimatedCameraMove';
import { AnimationConfig, config } from 'react-spring';
import { Vector3 } from 'three';

interface AutoMoveCameraProps {
  controls: MutableRefObject<CameraControlsImpl | undefined>;
  secondsBeforeMove?: number; // in frames
  animationConfig?: TimedAnimationConfig;
}

const AutoMoveCamera: FC<AutoMoveCameraProps> = ({
  controls,
  secondsBeforeMove = 5, // Default to 60 frames (approx 1 second at 60fps)
  animationConfig = { mass: 1, ...config.default, duration: 1 }
}) => {
  const [lastUserActiveTimestamp, setLastUserActiveTimestamp] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  const [isInDefaultPosition, setIsInDefaultPosition] = useState(true);


  const { isRunning, prepareLerp, runSpring } = useAnimatedCameraMove(controls, animationConfig as AnimationConfig);

  const resetInactivityTimer = () => {
    setIsUserActive(true);
    setLastUserActiveTimestamp(Date.now());
    setIsInDefaultPosition(false); // Reset this state when user interacts
  };

  useEffect(() => {
    const control = controls.current;
    control?.addEventListener('controlstart', resetInactivityTimer);
    control?.addEventListener('controlend', resetInactivityTimer);
    control?.addEventListener('control', resetInactivityTimer);

    return () => {
      control?.removeEventListener('controlstart', resetInactivityTimer);
      control?.removeEventListener('controlend', resetInactivityTimer);
    control?.removeEventListener('control', resetInactivityTimer);

    };
  }, [controls]);

  useFrame((state, delta) => {
    if (!controls.current) return;
    if (isUserActive) {
      if (Date.now() - lastUserActiveTimestamp > secondsBeforeMove * 1000 && !isRunning) {
        setIsUserActive(false);
        setNewTarget();
        runSpring();

      }
      // Set camera to default position if user becomes inactive
    } else {
      if (isInDefaultPosition && !isRunning) {
        // Rotate the camera around the origin if in default position
        const currentAzimuth = controls.current.azimuthAngle;

        void controls.current?.rotateAzimuthTo(currentAzimuth + (delta * .5), false);
      }
    }
  });


  const setNewTarget = () => {
    if (!controls.current) return
    const radius = 7;
    const height = 2;

    const phi = Math.acos(height / radius);
    const currentPos = controls.current.getPosition(new Vector3());
    const currentTheta = currentPos ? Math.atan2(currentPos.z, currentPos.x) : 0;

    const newPos = new Vector3().setFromSphericalCoords(radius, phi, currentTheta);
    const newTarget = [0, 0, 0] as [number, number, number];

    prepareLerp(newPos.toArray(), newTarget, 5);
    setIsInDefaultPosition(true);
  };

  useEffect(() => {
    if (isUserActive) {
      setIsInDefaultPosition(false);

    }
  }, [isUserActive]);

  // useEffect(() => {
  //   if (!isRunning && !isUserActive) {
  //     setNewTarget();
  //     runSpring();
  //   }
  // }, [isUserActive, isRunning, prepareLerp]);

  // Render logic or additional JSX if needed
  return null; // or return JSX
};

export default AutoMoveCamera;
