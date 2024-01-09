import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const useCameraTurns = () => {
    const [halfTurns, setHalfTurns] = useState(0);
    const [realHalfTurns, setRealHalfTurns] = useState(0);
    const [prevTheta, setPrevTheta] = useState(0);
    const [accumulatedTheta, setAccumulatedTheta] = useState(Math.PI / 2);
    const { get } = useThree();
    const controls = get().controls as OrbitControls;

    useEffect(() => {
        if (!controls) return;

        const updateTheta = () => {
            const currentTheta = controls.getAzimuthalAngle();
            let deltaTheta = currentTheta - prevTheta;

            // Correct for the angle wrapping from 2π to 0 and vice versa
            if (deltaTheta > Math.PI) {
                deltaTheta -= 2 * Math.PI;
            } else if (deltaTheta < -Math.PI) {
                deltaTheta += 2 * Math.PI;
            }

            // Accumulate the change in theta
            const newAccumulatedTheta = accumulatedTheta + deltaTheta;
            setAccumulatedTheta(newAccumulatedTheta);

            // Calculate the number of half turns
            setRealHalfTurns( newAccumulatedTheta/ Math.PI);
            setHalfTurns(Math.abs(Math.floor(realHalfTurns)));
            setPrevTheta(currentTheta);
            console.log(accumulatedTheta.toFixed(3), realHalfTurns.toFixed(3), (realHalfTurns % 1).toFixed(3) , halfTurns)
        };

        controls.addEventListener('change', updateTheta);
        return () => controls.removeEventListener('change', updateTheta);
    }, [controls, prevTheta, accumulatedTheta]);

    return halfTurns;
};

export default useCameraTurns;
