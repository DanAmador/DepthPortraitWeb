import { IDepthPortrait, DepthPortrait } from "./DepthPortrait";
import { GlassGlobe } from "./GlassGlobe";
import { useEffect, useMemo, useRef, useState } from "react";
import DepthBox from "./DepthBox";
import { useFrame } from "@react-three/fiber";

import { useCallback } from 'react';
import { useControls } from "leva";
import { portraitsList } from './portraitsList';



const colors = ['orange', 'lightblue', 'lightgreen', 'aquamarine', 'indianred', 'hotpink'];

const stageRotations: [number, number, number][] = [
    [0, 0, 0],
    [0, Math.PI, 0]
]
const stagePositions: [number, number, number][] = [
    [-.1, .1, 0],
    [-.1, .1, 0],
]
// eslint-disable-next-line react/prop-types
export const PortraitStage: React.FC<{ halfTurns: number }> = ({ halfTurns }) => {

    const [portraitState, setPortrait] = useState<IDepthPortrait[]>([]);
    const clickedRefs = useRef<number[]>([]);
    const [clickedPortraits, setClickedPortraits] = useState<number[]>([]);
    const [frontPortrait, setFrontPortrait] = useState<number>();
    const [backPortrait, setBackPortrait] = useState<number>();

    useEffect(() => {
        const totalPortraits = portraitsList.length;
        const offset = Math.floor(halfTurns / 2) * 2;
        const frontIndex = offset % totalPortraits;
        const backIndex = (frontIndex + 1) % totalPortraits;
        setFrontPortrait(frontIndex);
        setBackPortrait(backIndex);
    }, [halfTurns]);

    useEffect(() => {
        const randomPortraitOrder = [...portraitsList].sort(() => Math.random() - 0.5);
        const sideDataArray: IDepthPortrait[] = randomPortraitOrder.map((name) => ({
            portraitName: name,
            color: colors[Math.round(Math.random() *  colors.length) %  colors.length],
            depthExtrusion: 1
        }));
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
            const saveSchema = (pd: IDepthPortrait) => {
                if (pd) {

                    schema[`${pd.portraitName} Depth Extrusion`] = {
                        value: pd.depthExtrusion ?? 1,
                        min: 0,
                        max: 10,
                        step: 0.1,
                    };
                    schema[`${pd.portraitName} Color`] = pd.color ?? "pink";
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
                const pd = portraitState[portraitIdx];
                if (pd) {

                    return {
                        ...portrait, depthExtrusion: controls[`${pd.portraitName} Depth Extrusion`],
                        color: controls[`${pd.portraitName} Color`]
                    };
                }


            }));
        }
    }, [controls, frontPortrait, backPortrait, portraitState]);

    // Inside your component
    const buildPlane = useCallback((index: number, side: "front" | "back") => {
        const portraitIdx = index % portraitState.length;
        const selectedPortrait = portraitState[portraitIdx];
        const sideIdx = side === "front" ? 0 : 1;
        return (

            selectedPortrait && (

                <DepthBox
                    depth={selectedPortrait.depthExtrusion}
                    position={stagePositions[sideIdx]} rotation={stageRotations[sideIdx]}
                    key={`depthbox-${index}`} bg={selectedPortrait.color} index={index} onClick={clickHandler} >
                    {clickedPortraits.includes(index) && <GlassGlobe innerGlobeRadius={2} />}
                    <DepthPortrait {...selectedPortrait} />
                </DepthBox>
            )
        );
    }, [portraitState, clickedPortraits]);

    return (
        <>
            {buildPlane(backPortrait, "back")}
            {buildPlane(frontPortrait, "front")}

        </>

    );
}
