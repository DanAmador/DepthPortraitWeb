import { useMemo, useState } from 'react';
import { useControls } from 'leva';
import { IDepthPortrait } from './DepthPortrait'; // Ensure this import is correct

export const usePortraitControls = (
    portraitState: IDepthPortrait[],
    frontPortrait: number | undefined,
    backPortrait: number | undefined
) => {
    const [frontData, setFrontPortrait] = useState<IDepthPortrait>();
    const [backData, setBackPortrait] = useState<IDepthPortrait>();
    const controlSchema = useMemo(() => {
        const schema: Record<string, any> = {};

        const saveSchema = (portraitData: IDepthPortrait | undefined) => {
            if (portraitData) {
                schema[`${portraitData.name} Depth Extrusion`] = {
                    value: portraitData.depthExtrusion ?? 1,
                    min: 0,
                    max: 10,
                    step: 0.1,
                };
                schema[`${portraitData.name} Color`] = portraitData.color ?? "pink";
            }
        };

        if (portraitState?.length > 0) {
            const frontPortraitData = frontPortrait !== undefined ? portraitState[frontPortrait % portraitState.length] : undefined;
            const backPortraitData = backPortrait !== undefined ? portraitState[backPortrait % portraitState.length] : undefined;
            setFrontPortrait(frontPortraitData);
            setBackPortrait(backPortraitData);
            saveSchema(frontPortraitData)
            saveSchema(backPortraitData)
        }

        return schema;
    }, [frontPortrait, backPortrait, portraitState]);

    const controls = useControls(controlSchema);

    return {controls, frontData, backData};
};
