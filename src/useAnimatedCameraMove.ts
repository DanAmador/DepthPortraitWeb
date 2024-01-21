// import { useFrame, useThree } from '@react-three/fiber';
// import CameraControls from 'camera-controls';
// import { MutableRefObject, useEffect } from 'react';
// import { useSpring, SpringValue } from '@react-spring/core';
// import * as THREE from 'three';

// type AnimatedCameraMoveProps = {
//   cameraControlsRef: MutableRefObject<CameraControls | null>;
// };

// export const useAnimatedCameraMove = ({ cameraControlsRef }: AnimatedCameraMoveProps) => {
//   const { camera } = useThree();
//   const [spring, api] = useSpring(() => ({
//     t: 0,
//     config: { mass: 1, tension: 170, friction: 26 },
//     reset: true,
//   }));

//   const endPosition = new THREE.Vector3();
//   const startPosition = new THREE.Vector3();
//   const lookAtPosition = new THREE.Vector3();

//   const runSpring = () => {
//     api.start({ t: 0 });
//     setTimeout(() => api.start({ t: 1 }), 10);
//   };

//   const setVariables = (endArray = [0, 1, 0], lookAtArray = [0, 0, 0]) => {
//     camera.getWorldPosition(startPosition);
//     endPosition.set(...endArray);
//     lookAtPosition.set(...lookAtArray);
//     runSpring();
//   };

//   useFrame(() => {
//     const t = spring.t.get();
//     if (cameraControlsRef.current && t !== null) {
//       const currentPosition = new THREE.Vector3().lerpVectors(startPosition, endPosition, t);
//       cameraControlsRef.current.moveTo(currentPosition.x, currentPosition.y, currentPosition.z, false);
//     }
//   });

//   useEffect(() => {
//     // Any necessary clean-up
//     return () => {
//       // Clean-up code here (if necessary)
//     };
//   }, []); // Add dependencies if there are any

//   return { startMovingCamera: setVariables };
// };
