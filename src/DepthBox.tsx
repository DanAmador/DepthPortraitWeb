import React, { useRef, useEffect } from 'react';
import { Euler, Vector3, useThree } from '@react-three/fiber';
import { useGLTF, MeshPortalMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

interface DepthBoxProps {
  bg?: string;
  children: React.ReactNode;
  index: number;
  onClick: (index: number) => void;
  rotation?: Euler;
  position?: Vector3;
  depth: number;
}

export const DepthBox: React.FC<DepthBoxProps> = ({ bg = '#f0f0f0', children, position, rotation, depth }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF('/aobox-transformed.glb') as unknown as GLTF & { nodes: Record<string, THREE.Mesh> };

  const lightRef = useRef<THREE.DirectionalLight>();

  // const { camera, raycaster, mouse } = useThree();

  // const clickHandler = (e) => {

  //   if (box.current && mesh.current) {
  //     // Update the raycaster with the current mouse position
  //     raycaster.setFromCamera(mouse, camera);

  //     // Check for intersections with the mesh
  //     const boxIntersects = raycaster.intersectObject(box.current);
  //     const portraitIntersects = raycaster.intersectObject(mesh.current);
  //     // const gen = intersectionsGenerator(boxIntersects);
  //     for (let intersection of boxIntersects) {
  //       if (!intersection.face) {
  //         continue;
  //       }

  //       const clickedNormal = intersection?.face.normal.clone();

  //       // Transform the normal to world space
  //       clickedNormal.applyQuaternion(mesh.current.quaternion);

  //       // Vector from the camera to the clicked point on the mesh
  //       const cameraToMesh = intersection.point.clone().sub(camera.position).normalize();

  //       // Dot product
  //       const dot = cameraToMesh.dot(clickedNormal);

  //       // Check if the click is on the backside of the mesh
  //       if (dot > 0) {
  //         // onClick(index)

  //         // Perform actions for clicking the backside
  //         return;
  //       } else {
  //         onClick(index)
  //         // Perform actions for clicking the frontside
  //       }
  //     }
  //   }
  // };
  const boxScale = 1.5;

  useEffect(() => {
    if (lightRef.current && meshRef.current) {
      // Set the light to look at the target object
      lightRef.current.target = meshRef.current;
    }
  }, [lightRef, meshRef]);
  const clampedDepth = Math.max(depth, 0.1);
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={[3, 3, 3]} />
    <ambientLight color={0xffffff} intensity={0.5} />

    <MeshPortalMaterial >
      <group>
        <mesh receiveShadow geometry={nodes.Cube.geometry}
          ref={box} scale={[boxScale * clampedDepth, boxScale, boxScale]} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <meshStandardMaterial
            aoMapIntensity={0.3}
            aoMap={nodes.Cube.materialaoMap}

            color={"white"}
          />

          {/* <meshPhysicalMaterial metalnessMap={nodes.Cube.materialaoMap} /> */}

          <spotLight castShadow={true} color={bg} intensity={25 * Math.exp(clampedDepth) * clampedDepth}
            penumbra={0.6} shadow-normalBias={0.05} shadow-bias={0.0001}
            ref={lightRef}
            position={[Math.max(clampedDepth, 1), Math.max(1 - Math.sqrt(clampedDepth), 0), 0]} />
        </mesh>
        <mesh castShadow receiveShadow ref={meshRef}    >
          {children}
        </mesh>
      </group>
    </MeshPortalMaterial>
  </mesh>

};
//   return (
//     <MeshPortalMaterial attach={`material-${index}`} blur={0.5}>
//       <ambientLight intensity={0.5} />
//       <Environment preset="city" />
//       {/* <group rotation={rotation} position={position} > */}
//       <group  >

//         {/* <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} ref={box} scale={[1, 1, 1]} >
//           <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
//           <spotLight castShadow color={bg} intensity={2} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.0001} />
//         </mesh> */}
//         <mesh castShadow receiveShadow ref={mesh} rotation={[0, 3.14 / 2, 0]}   >
//           {children}
//           <meshStandardMaterial color={bg} />
//         </mesh>
//       </group>
//     </MeshPortalMaterial>
//   );
// };

export default DepthBox;
