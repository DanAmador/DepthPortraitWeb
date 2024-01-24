import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

const useCameraTurns = (azimuth: number) => {
    const [halfTurns, setHalfTurns] = useState(0);
    const [realHalfTurns, setRealHalfTurns] = useState(0);
    useFrame(() => {

            setRealHalfTurns( azimuth/ Math.PI * .5);
            setHalfTurns(Math.abs(Math.floor(realHalfTurns)));
            // setPrevTheta(currentTheta);
            // console.log(accumulatedTheta.toFixed(3), realHalfTurns.toFixed(3), (realHalfTurns % 1).toFixed(3) , halfTurns)
        });
        return halfTurns;

        // controls.addEventListener('change', updateTheta);
    };
        // return () => {
        //     if (controls) {
        //         controls.removeEventListener('change', updateTheta);
        //     }

export default useCameraTurns;
