import { IDepthPortrait, IPortrait, DepthPortrait } from "./DepthPortrait";
import { GlassGlobe } from "./GlassGlobe";
import { Edges } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import DepthBox from "./DepthBox";
import { useFrame } from "@react-three/fiber";
// import { Schema } from "leva/dist/declarations/src/types";

import { useCallback } from 'react';



const portraitData: Record<string, IPortrait> = {
    "DigitalSoul": { name: "DigitalSoul", color: "DigitalSoul.png", depth: "depth_DigitalSoul.png" },
    "GrayMan": { name: "GrayMan", color: "grey.png", depth: "depth_grey.png" },
    "Hands": { name: "Hands", color: "hands.png", depth: "depth_hands.png" },
    "Obelisk": { name: "Obelisk", color: "obelisk.png", depth: "depth_obelisk.png" },
    "LineMan": { name: "LineMan", color: "line.png", depth: "depth_line.png" },
    "Road": { name: "Road", color: "Road.png", depth: "depth_Road.png" },
    // "RoboWorld": { name: "RoboWorld", color: "RoboWorld.png", depth: "depth_RoboWorld.png" },
    "Skull": { name: "Skull", color: "skull.png", depth: "depth_skull.png" }
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
export const InvisiCube: React.FC<{halfTurns: number}> = ({halfTurns}) => {
    const [portraitState, setPortrait] = useState<IDepthPortrait[]>([]);
    const clickedRefs = useRef<number[]>([]);
    const [clickedPortraits, setClickedPortraits] = useState<number[]>([]);

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

    // const createControlSchema = (portraitState: IDepthPortrait[], clickedPortraits: number[]) => {
    //     const schema: Schema = {};
    //     portraitState.forEach((portrait, index) => {
    //         const name = portraitState[index].name;
    //         schema[`${name} Depth Extrusion`] = {
    //             value: portrait.depthExtrusion,
    //             min: 0,
    //             max: 10,
    //             step: 0.1
    //         };
    //         // schema[`${name} - Color`] = {
    //         //     value: portrait.color
    //         // };
    //     });
    //     return schema;
    // };
    // Recalculate control schema when clickedPortraits changes
    // const controlSchema = useMemo(() => createControlSchema(portraitState, clickedPortraits), [portraitState, clickedPortraits]);


    // const controls = useControls(controlSchema);
    // useEffect(() => {
    //     const updatedPortraits = portraitState.map((portrait, index) => ({
    //         ...portrait,
    //         depthExtrusion: controls[`Portrait ${index + 1} - Depth Extrusion`] as number,
    //         color: controls[`Portrait ${index + 1} - Color`] as string
    //     }));

    //     // I do not know why but the controls are only shown if the typescript file is saved
    //     if (updatedPortraits.length != 0) {
    //         setPortrait(updatedPortraits);

    //     }
    // }, [controls]); // Depend only on controls

    // Inside your component
    const buildPlane = useCallback((planeSide: "front" | "back") => {
        const totalPortraits = Object.keys(portraitData).length;
    
        // Calculate the index offset every time a full turn (2 half turns) is completed
        const offset = Math.floor(halfTurns / 2) * 2;
    
        // Determine the indices for the front and back DepthBoxes
        const frontIndex = offset % totalPortraits;
        const backIndex = (frontIndex + 1) % totalPortraits;
    console.log(frontIndex, backIndex, portraitState);
        // Select the portraits for front and back
        const frontPortrait = portraitState[frontIndex];
        const backPortrait = portraitState[backIndex];
    
        const isFront = planeSide === "front";
        const selectedPortrait = isFront ? frontPortrait : backPortrait;
        const selectedIndex = isFront ? frontIndex : backIndex;
        return (
            <mesh castShadow receiveShadow key={`mesh-${planeSide}`} position={stagePositions[isFront ? 0 : 1]} rotation={stageRotations[isFront ? 0 : 1]}>
                <planeGeometry args={[3, 3, 3]} />
                <Edges />
                {selectedPortrait && (
                    <DepthBox key={`${planeSide}-${selectedIndex}`} bg={selectedPortrait.color} index={selectedIndex} onClick={clickHandler} position={stagePositions[isFront ? 0 : 1]}>
                        {clickedPortraits.includes(selectedIndex) && <GlassGlobe innerGlobeRadius={2} />}
                        <DepthPortrait {...selectedPortrait} portraitData={portraitData[selectedPortrait.name]} />
                    </DepthBox>
                )}
            </mesh>
        );
    }, [halfTurns, portraitState, portraitData, stagePositions, stageRotations, clickHandler]);
    
    return (
        <>
            {buildPlane("front")}
            {buildPlane("back")}
            {/* {buildPlane(1)} */}
        </>

    );
}
