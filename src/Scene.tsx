/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Object3DNode, extend, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import { AdaptiveDpr, CameraControls } from '@react-three/drei';
import { LumaSplatsThree } from "@lumaai/luma-web";
import { useEffect, useRef, useState } from "react";
import { PortraitStage } from "./PortraitStage";
import CameraControlsImpl from 'camera-controls';
// import { useControls, button, buttonGroup, folder } from 'leva'
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

  // const { DEG2RAD } = THREE.MathUtils
  // const { camera } = useThree()

  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  // const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
  //   thetaGrp: buttonGroup({
  //     label: 'rotate theta',
  //     opts: {
  //       '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
  //       '-90º': () => cameraControlsRef.current?.rotate(-180 * DEG2RAD, 0, true),
  //       '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
  //     }
  //   }),
  //   phiGrp: buttonGroup({
  //     label: 'rotate phi',
  //     opts: {
  //       '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
  //       '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
  //     }
  //   }),
  //   truckGrp: buttonGroup({
  //     label: 'truck',
  //     opts: {
  //       '(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
  //       '(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
  //       '(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
  //     }
  //   }),
  //   dollyGrp: buttonGroup({
  //     label: 'dolly',
  //     opts: {
  //       '1': () => cameraControlsRef.current?.dolly(1, true),
  //       '-1': () => cameraControlsRef.current?.dolly(-1, true)
  //     }
  //   }),
  //   zoomGrp: buttonGroup({
  //     label: 'zoom',
  //     opts: {
  //       '/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
  //       '/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
  //     }
  //   }),
  //   minDistance: { value: 0 },
  //   moveTo: folder(
  //     {
  //       vec1: { value: [3, 5, 2], label: 'vec' },
  //       'moveTo(…vec)': button((get) => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
  //     },
  //     { collapsed: true }
  //   ),
  //   'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
  //   setPosition: folder(
  //     {
  //       vec2: { value: [-5, 2, 1], label: 'vec' },
  //       'setPosition(…vec)': button((get) => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
  //     },
  //     { collapsed: true }
  //   ),
  //   setTarget: folder(
  //     {
  //       vec3: { value: [3, 0, -3], label: 'vec' },
  //       'setTarget(…vec)': button((get) => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
  //     },
  //     { collapsed: true }
  //   ),
  //   setLookAt: folder(
  //     {
  //       vec4: { value: [1, 2, 3], label: 'position' },
  //       vec5: { value: [1, 1, 0], label: 'target' },
  //       'setLookAt(…position, …target)': button((get) => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
  //     },
  //     { collapsed: true }
  //   ),
  //   lerpLookAt: folder(
  //     {
  //       vec6: { value: [-2, 0, 0], label: 'posA' },
  //       vec7: { value: [1, 1, 0], label: 'tgtA' },
  //       vec8: { value: [0, 2, 5], label: 'posB' },
  //       vec9: { value: [-1, 0, 0], label: 'tgtB' },
  //       t: { value: Math.random(), label: 't', min: 0, max: 1 },
  //       'f(…posA,…tgtA,…posB,…tgtB,t)': button((get) => {
  //         return cameraControlsRef.current?.lerpLookAt(
  //           ...get('lerpLookAt.vec6'),
  //           ...get('lerpLookAt.vec7'),
  //           ...get('lerpLookAt.vec8'),
  //           ...get('lerpLookAt.vec9'),
  //           get('lerpLookAt.t'),
  //           true
  //         )
  //       })
  //     },
  //     { collapsed: true }
  //   ),
  //   saveState: button(() => cameraControlsRef.current?.saveState()),
  //   reset: button(() => cameraControlsRef.current?.reset(true)),
  //   enabled: { value: true, label: 'controls on' },
  //   verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
  //   dollyToCursor: { value: false, label: 'dolly to cursor' },
  //   infinityDolly: { value: false, label: 'infinity dolly' }
  // })

  const [halfTurns, setHalfTurns] = useState(0);
  const [realHalfTurns, setRealHalfTurns] = useState(0);
  useFrame(() => {

      // Calculate the number of half turns
      const offset = Math.PI / 2
      setRealHalfTurns((offset + cameraControlsRef.current?.azimuthAngle ?? 0) / Math.PI);
      setHalfTurns(Math.abs(Math.floor(Math.abs(realHalfTurns))));
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
  // const {setVariables} = useAnimatedCameraMove(cameraControlsRef);
  // useEffect(() => {
  //   window.setPosition = setVariables;
  // },[])
  // const {startMovingCamera } = useControls({
  //   'Camera Movement': 

  //     moveCamera: button(() => {
  //       window.lerpCam();
  //   }),
  // });
  return <>

    <AdaptiveDpr pixelated />
    <CameraControls
          ref={cameraControlsRef}
          // minDistance={minDistance}
          // enabled={enabled}
          // verticalDragToForward={verticalDragToForward}
          // dollyToCursor={dollyToCursor}
          // infinityDolly={infinityDolly}
        />
    {/* <CameraControls makeDefault /> */}
    {/* <OrbitControls makeDefault /> */}
    <PortraitStage halfTurns={halfTurns} />
    <lumaSplats
      ref={lumaSplatRef}

      // semanticsMask={LumaSplatsSemantics.FOREGROUND}

      position={[-.5, 0, .06]}
      scale={[2, 2, 2]}
      rotation={[0,-.09,0]}
      source='https://lumalabs.ai/capture/2f4a6b64-f0bd-4e3e-a41a-c3aec8b96517' 
      />
  </>
}

export default Scene;