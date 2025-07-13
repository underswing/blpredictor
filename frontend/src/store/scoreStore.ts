import {IPageMetadata, IScoreCompact} from "../common/model.ts";
import {create} from "zustand/react";

type ScoreStoreType =  {
    scores: IScoreCompact[];
    setScores: (scores: IScoreCompact[]) => void;
    metadata?: IPageMetadata;
    setMetadata: (metadata?: IPageMetadata) => void;
}

export const useScoreStore = create<ScoreStoreType>((set) => ({
    scores: [],
    setScores: (scores) => set({scores}),
    metadata: undefined,
    setMetadata: (metadata) => set({metadata})
}))