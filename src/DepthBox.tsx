import React, { useRef } from 'react';
import { Euler, Vector3 } from '@react-three/fiber';
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
}

export const DepthBox: React.FC<DepthBoxProps> = ({ bg = '#f0f0f0', children}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF('/aobox-transformed.glb') as unknown as GLTF & { nodes: Record<string, THREE.Mesh> };


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
  return <MeshPortalMaterial blur={0.5}>
    <ambientLight intensity={0.1} />
    <Environment preset="forest" background />
    <group>
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} ref={box} scale={[4, 4, 10]} position={[0, 0, 3.5]} rotation={[0,-Math.PI / 2,0 ]}>
        <meshStandardMaterial aoMapIntensity={0.3}  color={bg}/>
        {/* aoMap={nodes.Cube.materialaoMap} */}
        <spotLight castShadow color={bg} intensity={2} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.0001} />
      </mesh>
      <mesh castShadow receiveShadow ref={mesh} rotation={[0, 0, 0]}   >
        {children}
        <meshStandardMaterial color={bg} />
      </mesh>
    </group>
  </MeshPortalMaterial>
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
