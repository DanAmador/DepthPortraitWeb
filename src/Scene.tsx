import { Canvas, Object3DNode, extend, useThree } from "@react-three/fiber";
import "./App.css";
import { CineonToneMapping } from "three";
import { Box, PivotControls } from "@react-three/drei";
import { AdaptiveDpr, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";
import { InvisiCube } from "./Invisicube";
import { useEffect, useRef } from "react";
import useCameraTurns from "./useCameraTurns";

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
 const halfTurns = useCameraTurns();
  useEffect(() => {
    if (lumaSplatRef.current) {
      // Assuming lumaSplatRef.current has a method captureCubemap
      lumaSplatRef.current.captureCubemap(gl).then((cubemap) => {
        // scene.environment = cubemap;
        scene.background = cubemap;
      });
    }
  }, [gl, scene]);

  return <>
    <AdaptiveDpr pixelated />
    <OrbitControls makeDefault />
    <InvisiCube halfTurns={halfTurns}/>
    <lumaSplats
      ref={lumaSplatRef}

      // semanticsMask={LumaSplatsSemantics.FOREGROUND}

      position={[-.5, 0, .06]}
      scale={[2, 2, 2]}
      rotation={[0,-.09,0]}
      source='https://lumalabs.ai/capture/2f4a6b64-f0bd-4e3e-a41a-c3aec8b96517' />
  </>
}

export default Scene;
