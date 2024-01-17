/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IDepthPortrait, IPortrait, DepthPortrait } from "./DepthPortrait";
import { GlassGlobe } from "./GlassGlobe";
import { Edges } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import DepthBox from "./DepthBox";
import { useFrame } from "@react-three/fiber";
// import { Schema } from "leva/dist/declarations/src/types";

import { useCallback } from 'react';
import useCameraTurns from "./useCameraTurns";
import { useControls } from "leva";



const portraitData: Record<string, IPortrait> = {
    "DigitalSoul": { name: "DigitalSoul", color: "DigitalSoul", depth: "depth_DigitalSoul" },
    "GrayMan": { name: "GrayMan", color: "grey", depth: "depth_grey" },
    "Hands": { name: "Hands", color: "hands", depth: "depth_hands" },
    "Obelisk": { name: "Obelisk", color: "obelisk", depth: "depth_obelisk" },
    "LineMan": { name: "LineMan", color: "line", depth: "depth_line" },
    "Road": { name: "Road", color: "Road", depth: "depth_Road" },
    // "RoboWorld": { name: "RoboWorld", color: "RoboWorld", depth: "depth_RoboWorld" },
    "Skull": { name: "Skull", color: "skull", depth: "depth_skull" }
};
const colors = ['orange', 'lightblue','lightgreen', 'aquamarine', 'indianred', 'hotpink'];

// const cubeRotations: [number, number, number][] = [
//     [0, 0, 0],
//     [0, Math.PI, 0],
//     [0, Math.PI / 2, Math.PI / 2],
//     [0, Math.PI / 2, -Math.PI / 2],
//     [0, -Math.PI / 2, 0],
//     [0, Math.PI / 2, 0]
// ];

const stageRotations: [number, number, number][] = [
    [0, 0, 0],
    [0, Math.PI, 0]
]
const stagePositions: [number, number, number][] = [
    [0, .1, -.1],
    [0, .1, .1],
]
// eslint-disable-next-line react/prop-types
export const InvisiCube: React.FC<{halfTurns:number}> = ({halfTurns}) => {

    const [portraitState, setPortrait] = useState<IDepthPortrait[]>([]);
    const clickedRefs = useRef<number[]>([]);
    const [clickedPortraits, setClickedPortraits] = useState<number[]>([]);
    const [frontPortrait, setFrontPortrait] = useState<number>();
    const [backPortrait, setBackPortrait] = useState<number>();
    
    useEffect(() => {
        const totalPortraits = Object.keys(portraitData).length;

        // Calculate the index offset every time a full turn (2 half turns) is completed
        const offset = Math.floor(halfTurns / 2) * 2;
      
        // Determine the indices for the front and back DepthBoxes
        const frontIndex = offset % totalPortraits;
        const backIndex = (frontIndex + 1) % totalPortraits;

        setFrontPortrait(frontIndex)
        setBackPortrait(backIndex)

    },[halfTurns]);

    useEffect(() => {
        const sideDataArray: IDepthPortrait[] = [];
        Object.keys(portraitData).forEach((key, i) => {
            if (i < colors.length) {
                sideDataArray.push({
                    color: colors[i],
                    depthExtrusion: 1,
                    name: key
                });
            }
        });
        console.log(sideDataArray);
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

    // Create a control schema for the current front and back portraits
    const controlSchema = useMemo(() => {
        const schema = {};
    
        // Ensure portraitState has elements
        if (portraitState.length > 0) {
            const saveSchema= (portraitData: IDepthPortrait) => {
                if(portraitData){

                    schema[`${portraitData.name} Depth Extrusion`] = {
                        value: portraitData.depthExtrusion ?? 1,
                        min: 0,
                        max: 10,
                        step: 0.1,
                    };
                    schema[`${portraitData.name} Color`] = portraitData.color ?? "pink";
                }
            } 
            const frontPortraitData = portraitState[frontPortrait % portraitState.length];
            const backPortraitData = portraitState[backPortrait % portraitState.length];
            saveSchema(frontPortraitData);
            saveSchema(backPortraitData);
        }
    
        return schema;
    }, [frontPortrait, backPortrait, portraitState]);
    
    const controls = useControls(controlSchema, [frontPortrait, backPortrait]);
    
    useEffect(() => {
        // Check if portraitState has elements
        if (portraitState.length > 0) {
            setPortrait(prevState => prevState.map((portrait, index) => {
                const portraitIdx = index % portraitState.length;
                const portraitData = portraitState[portraitIdx];
                if(portraitData){

                    return { ...portrait, depthExtrusion: controls[`${portraitData.name} Depth Extrusion`],
                     color: controls[`${portraitData.name} Color`] };
                }

                 
            }));
        }
    }, [controls, frontPortrait, backPortrait, portraitState.length]);

    // Inside your component
    const buildPlane = useCallback((index: number, side : "front" | "back") => {
        const portraitIdx = index % portraitState.length;
        const selectedPortrait = portraitState[portraitIdx];
        const sideIdx = side === "front" ? 0 : 1; 
        return (
            <mesh castShadow receiveShadow key={`mesh-${index}-${side}`} 
            // eslint-disable-next-line react/no-unknown-property
            position={stagePositions[sideIdx]} rotation={stageRotations[sideIdx]}>
                <planeGeometry args={[3, 3, 3]} />
                <Edges />
                {selectedPortrait && (
                    <DepthBox key={`depthbox-${index}`} bg={selectedPortrait.color} index={index} onClick={clickHandler} position={stagePositions[sideIdx]}>
                        {clickedPortraits.includes(index) && <GlassGlobe innerGlobeRadius={2} />}
                        <DepthPortrait {...selectedPortrait} portraitData={portraitData[selectedPortrait.name]} />
                    </DepthBox>
                )}
            </mesh>
        );
    }, [portraitState, clickedPortraits]);
    // console.log(`front ${frontPortrait} back ${backPortrait} size ${portraitState.length}`);

    return (
        <>
            {buildPlane(backPortrait, "back")}
            {buildPlane(frontPortrait, "front")}
            {/* {buildPlane(backPortrait)} */}
            {/* {buildPlane(1)} */}
        </>

    );
}
