/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Object3DNode, extend, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import { AdaptiveDpr, CameraControls } from '@react-three/drei';
import { LumaSplatsThree } from "@lumaai/luma-web";
import { useEffect, useRef, useState } from "react";
import { PortraitStage } from "./PortraitStage";
import CameraControlsImpl from 'camera-controls';
// import { useControls, button } from "leva";
import { useAnimatedCameraMove } from "./useAnimatedCameraMove";
import AutoMoveCamera from "./withAutoMoveCamera";
// import * as THREE from 'three'

// Make LumaSplatsThree available to R3F
extend({ LumaSplats: LumaSplatsThree });

// For typeScript support:
declare module '@react-three/fiber' {
  interface ThreeElements {
    lumaSplats: Object3DNode<LumaSplatsThree, typeof LumaSplatsThree>
  }
}
function Scene() {
  const { scene, gl } = useThree();
  const lumaSplatRef = useRef<LumaSplatsThree>(null);
  const cameraControlsRef = useRef<CameraControlsImpl>()

  const [halfTurns, setHalfTurns] = useState(0);
  const [realHalfTurns, setRealHalfTurns] = useState(0);
  useFrame(() => {
    if (cameraControlsRef.current) {

      const offset = Math.PI / 2
      // Calculate the number of half turns
      setRealHalfTurns((offset + cameraControlsRef.current?.azimuthAngle ?? 0) / Math.PI);
      setHalfTurns(Math.abs(Math.floor(Math.abs(realHalfTurns))));
    }
  });

  useEffect(() => {
    if (lumaSplatRef.current) {
      // Assuming lumaSplatRef.current has a method captureCubemap
      scene.environment = null;
      scene.background = null;
      // void lumaSplatRef.current.captureCubemap(gl).then((cubemap) => {
      // // lumaSplatRef.current.material.transparent = false;
      // });
    }
  }, [gl, scene]);
  useEffect(() => {
    window.setLerp = setVariables;
    window.runLerp = runSpring;
  }, [cameraControlsRef])
  
  const { setVariables, runSpring } = useAnimatedCameraMove(cameraControlsRef);
  return <>
    <AdaptiveDpr pixelated />
    <CameraControls makeDefault ref={cameraControlsRef} />
    <AutoMoveCamera controls={cameraControlsRef} />
    <PortraitStage halfTurns={halfTurns} />
    <lumaSplats
      ref={lumaSplatRef}

      // semanticsMask={LumaSplatsSemantics.FOREGROUND}

      position={[-.5, 0, .06]}
      scale={[2, 2, 2]}
      rotation={[0, -.09, 0]}
      source='https://lumalabs.ai/capture/2f4a6b64-f0bd-4e3e-a41a-c3aec8b96517'
    />
  </>
}

export default Scene;
