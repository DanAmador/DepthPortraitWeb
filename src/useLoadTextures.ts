import { useState, useEffect } from "react";
import { IPortrait } from "./DepthPortrait";

const useLoadTextures = (portraitData: IPortrait) => {
    // const [textures, setTextures] = useState({ rgbTexture: null, depthTexture: null });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadTextures = () => {
            
            try {
                const modules = import.meta.glob('./src/assets/Portraits/*');

                Object.entries(modules).forEach(([path, resolver]) => {
                  void resolver().then((module) => {
                    console.log(path, module);
                    // You can now use module.default as the imported module (e.g., an image URL)
                  });
                });
                


                
                // setTextures({ rgbTexture, depthTexture });
            } catch (error) {
                console.log("Error loading textures, trying again");
                // Handle the error appropriately
            } finally {
                setLoading(false);
            }

        };

        void loadTextures();
    }, [portraitData, loading]);

    return loading ;
};

export default useLoadTextures;
