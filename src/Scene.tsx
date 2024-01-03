import { Canvas, Object3DNode, extend, useThree } from "@react-three/fiber";
import "./App.css";
import { CineonToneMapping } from "three";
import { Box, PivotControls } from "@react-three/drei";
import { AdaptiveDpr, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";
import { InvisiCube } from "./Invisicube";
import { useEffect, useRef } from "react";

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
    <InvisiCube />
    {/* <lumaSplats
      ref={lumaSplatRef}

      // semanticsMask={LumaSplatsSemantics.BACKGROUND}

      position={[0, 0, 0]}
      scale={[2, 2, 2]}
      source='https://lumalabs.ai/capture/6331c1bb-3352-4c8e-b691-32b9b70ec768' /> */}
  </>
}

export default Scene;
