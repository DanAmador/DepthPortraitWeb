import { useFrame, useThree } from '@react-three/fiber';
import CameraControls from 'camera-controls';
import { MutableRefObject } from 'react';
import { useSpring } from 'react-spring';
import * as THREE from 'three';

export const useAnimatedCameraMove = (cameraControlsRef: MutableRefObject<CameraControls>) => {
  const { camera, scene } = useThree();
  const [spring, api] = useSpring(() => ({
    t: 0,
    config: { mass: 1, tension: 170, friction: 26 },
    reset: true
  }));

  const endPosition = new THREE.Vector3();
  const startPosition = new THREE.Vector3()
  const lookAtPosition = new THREE.Vector3();
  const runSpring = () => {
    // Smoothly adjust camera to the start position first
    // camera.position.lerpVectors(camera.position, startPosition, 0.1);
    // endPosition.copy(end);
    // Reset the spring to start the animation
    api.start({ t: 0 });

    // Start the animation
    setTimeout(() => api.start({ t: 1 }), 10); // Small timeout ensures the reset is applied first
  }

  // This function will be called to start the camera movement
  const setVariables = ( endArray = [0,1,0], lookAtArray = [0,0,0]) => {
    camera.getWorldPosition(startPosition);
    endPosition.copy(new THREE.Vector3(...endArray));
    lookAtPosition.copy(new THREE.Vector3(...lookAtArray));
    //     console.log(t,startPosition, endPosition,currentPosition, lookAtPosition);
    
    runSpring( );
  };

  useFrame(() => {
    const t = spring.t.get();
    if (cameraControlsRef.current) {
      const currentPosition = new THREE.Vector3().lerpVectors(startPosition, endPosition, t);
      void cameraControlsRef.current.moveTo(currentPosition.x, currentPosition.y, currentPosition.z, false);
    //   cameraControlsRef.current.update();
    // if(t < .99){

    // }
    }
  });

  return {startMovingCamera: setVariables};
};
