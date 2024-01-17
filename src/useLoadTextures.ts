import { useState, useEffect } from "react";
import { IPortrait } from "./DepthPortrait";

const useLoadTextures = (portraitData: IPortrait) => {
    const [textures, setTextures] = useState({ rgbTexture: null, depthTexture: null });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadTextures = async () => {
            
            try {
                // await import(`./src/assets/Portraits/${portraitData.name}/${portraitData.color}.png`);
                // await import(`./src/assets/Portraits/${portraitData.name}/${portraitData.depth}.png`);
                


                
                setTextures({ rgbTexture, depthTexture });
            } catch (error) {
                console.log("Error loading textures, trying again");
                // Handle the error appropriately
            } finally {
                setLoading(false);
            }

        };

        void loadTextures();
    }, [portraitData, loading]);

    return { ...textures, loading };
};

export default useLoadTextures;
