import { DepthPortrait, DepthPortraitProps, PortraitData } from "./DepthPortrait";
import { GlassGlobe } from "./GlassGlobe";
import { Edges } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useControls } from "leva";
import { Mesh } from "three";
import DepthBox from "./DepthBox";
import { useFrame } from "@react-three/fiber";
import { Schema } from "leva/dist/declarations/src/types";




const portraitData: PortraitData[]= [
    { name: "DigitalSoul", color: "DigitalSoul.png", depth: "depth_DigitalSoul.png" },
    { name: "GrayMan", color: "grey.png", depth: "depth_grey.png" },
    { name: "Hands", color: "hands.png", depth: "depth_hands.png" },
    { name: "Obelisk", color: "obelisk.png", depth: "depth_obelisk.png" },
    { name: "LineMan", color: "line.png", depth: "depth_line.png" },
    { name: "Road", color: "Road.png", depth: "depth_Road.png" },
    { name: "RoboWorld", color: "RoboWorld.png", depth: "depth_RoboWorld.png" },
    { name: "Skull", color: "skull.png", depth: "depth_skull.png" }
  ];
  const colors = ['orange', 'lightblue', 'lightgreen', 'aquamarine', 'indianred', 'hotpink'];


export function InvisiCube() {
    const [portraitState, setPortrait] = useState<DepthPortrait[]>([]);
    const clickedRefs = useRef<number[]>([]);
    const [clickedPortraits, setClickedPortraits] = useState<number[]>([]);

    useEffect(() => {
        const sideDataArray: DepthPortrait[] = [];
        for (let i = 0; i < colors.length; i++) {
            sideDataArray.push({
              color: colors[i],
              depthExtrusion: 1
            });
        }
        setPortrait(sideDataArray);
    }, []);

    const clickHandler = (objectID: number) => {
        clickedRefs.current.push(objectID);
    };

    useFrame(() => {
        if (clickedRefs.current.length !== 0) {
            setClickedPortraits([...clickedRefs.current]);
            clickedRefs.current.length = 0;
        }
    });

    const createControlSchema = (portraitState: DepthPortrait[], clickedPortraits: number[]) => {
        const schema: Schema = {};
        portraitState.forEach((portrait, index) => {
          schema[`Portrait ${index + 1} - Depth Extrusion`] = {
            value: portrait.depthExtrusion,
            min: 0,
            max: 10,
            step: 0.1
          };
          schema[`Portrait ${index + 1} - Color`] = {
            value: portrait.color
          };
        });
        return schema;
    };
    // Recalculate control schema when clickedPortraits changes
    const controlSchema = useMemo(() => createControlSchema(portraitState, clickedPortraits), [portraitState, clickedPortraits]);

    
    const controls = useControls(controlSchema);
    useEffect(() => {
        const updatedPortraits = portraitState.map((portrait, index) => ({
          ...portrait,
          depthExtrusion: controls[`Portrait ${index + 1} - Depth Extrusion`] as number,
          color: controls[`Portrait ${index + 1} - Color`] as string
        }));

    // I do not know why but the controls are only shown if the typescript file is saved
        if(updatedPortraits.length != 0){
            setPortrait(updatedPortraits);

        }
    }, [controls]); // Depend only on controls

    return (
        <>
        {/* <GlassGlobe innerGlobeRadius={2} /> */}
        <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <Edges />
            {portraitState.map(( portrait, index) => (
                <DepthBox key={index} bg={portrait.color} index={index} onClick={clickHandler}>
                    {clickedPortraits.includes(index) && <GlassGlobe innerGlobeRadius={2} />}
                    <DepthPortrait {...portrait}  portraitData={portraitData[index]} />
                </DepthBox>
            ))}
        </mesh></>
    );
}
