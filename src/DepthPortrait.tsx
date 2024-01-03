import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';
export interface PortraitData {
    name: string;
    color: string;
    depth: string;
  }

  export interface DepthPortrait {
    depthExtrusion: number;
    color: string;
  }
  export interface DepthPortraitProps extends DepthPortrait  {
    portraitData: PortraitData;

  }
  
  export const DepthPortrait: React.FC<DepthPortraitProps> = ({ portraitData, depthExtrusion =1 }) => {
  
    const meshRef = useRef();
  const rgbTexture = useLoader(THREE.TextureLoader,     `Portraits/${portraitData.name}/${portraitData.color}`);
  const depthTexture = useLoader(THREE.TextureLoader,   `Portraits/${portraitData.name}/${portraitData.depth}`);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry>();


  // Create a custom shader material
  const customMaterial = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      uniform sampler2D depthTexture;
      uniform float depthExtrusion; // Added uniform for depthExtrusion

      void main() {
        vUv = uv;
        float depth = texture2D(depthTexture, uv).r;
        vec3 displacedPosition = position + normal * depth * depthExtrusion; // Use uniform here
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D rgbTexture;

      void main() {
        vec3 color = texture2D(rgbTexture, vUv).rgb;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    return new ShaderMaterial({
      uniforms: {
        rgbTexture: { value: rgbTexture },
        depthTexture: { value: depthTexture },
        depthExtrusion: { value: depthExtrusion } // Added uniform
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });
  }, [portraitData, depthExtrusion]); // Add depthExtrusion to the dependency array

  // Plane geometry setup
  useEffect(() => {
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);
    setGeometry(planeGeometry);
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} material={customMaterial} position={[0,0,-.5 * depthExtrusion]}>
    </mesh>
  );
};
