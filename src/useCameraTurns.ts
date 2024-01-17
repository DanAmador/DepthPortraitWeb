import { useEffect, useState } from 'react';
import CameraControlsImpl from 'camera-controls';
import { useFrame } from '@react-three/fiber';

const useCameraTurns = (azimuth) => {
    const [halfTurns, setHalfTurns] = useState(0);
    const [realHalfTurns, setRealHalfTurns] = useState(0);
    const [prevTheta, setPrevTheta] = useState(0);
    const [accumulatedTheta, setAccumulatedTheta] = useState(Math.PI / 2);
    useFrame(() => {

            setRealHalfTurns( azimuth/ Math.PI * .5);
            setHalfTurns(Math.abs(Math.floor(realHalfTurns)));
            setPrevTheta(currentTheta);
            console.log(accumulatedTheta.toFixed(3), realHalfTurns.toFixed(3), (realHalfTurns % 1).toFixed(3) , halfTurns)
        };

        controls.addEventListener('change', updateTheta);
        return () => {
            if (controls) {
                controls.removeEventListener('change', updateTheta);
            }
        };
    }, [controls]); 
    return halfTurns;
};

export default useCameraTurns;
