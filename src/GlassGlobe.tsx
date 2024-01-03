import React, { useRef, useEffect } from 'react';
import { Mesh, FrontSide } from 'three';

type GlassGlobeProps = {
  innerGlobeRadius: number;
};

export const GlassGlobe: React.FC<GlassGlobeProps> = ({ innerGlobeRadius}) => {
  const globeRef = useRef<Mesh>(null);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.scale.setScalar(innerGlobeRadius);
    }
  }, [innerGlobeRadius]);


  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        roughness={0}
        metalness={0}
        transparent={false}
        transmission={1}
        ior={1.341}
        thickness={2}
        envMapIntensity={1.2}
        clearcoat={1}
        side={FrontSide}
      />
    </mesh>
  );
};