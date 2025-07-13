import {IBLRankedMap, IPageMetadata} from "../common/model.ts";
import {create} from "zustand/react";

type MapStoreType =  {
    maps: IBLRankedMap[];
    setMaps: (maps: IBLRankedMap[]) => void;
    metadata?: IPageMetadata;
    setMetadata: (metadata?: IPageMetadata) => void;
}

export const useMapStore = create<MapStoreType>((set) => ({
    maps: [],
    setMaps: (maps) => set({maps}),
    metadata: undefined,
    setMetadata: (metadata) => set({metadata})
}))