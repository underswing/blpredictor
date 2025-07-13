export interface IMapCache {
    lastFetch: number,
    maps: IBLRankedLeaderboard[]
}

interface IMetadata {
    itemsPerPage: number;
    page: number;
    total: number;
}

export interface IBLLeaderboardsResponse {
    metadata: IMetadata;
    data: IBLRankedLeaderboard[];
}

export interface IBLScoresResponse {
    metadata: IMetadata;
    data: IScoreCompact[];
}

export interface IScoreCompact {
    score: {
        id: number;
        fullCombo: number;
        missedNotes: number;
        badCuts: number;
        accuracy: number;
        pp: number;
    }
    leaderboard: {
        id: string;
        songHash: string;
        modeName: string;
        difficulty: number;
    }
}

export interface IPPInfo {
    totalPP: number;
    passPP: number;
    accPP: number;
    techPP: number;
}

export interface IBLRankedLeaderboard {
    id: string;
    potentialWeighted: number;
    potentialWeightedChange: number;
    ppInfo: IPPInfo;
    song: {
        id: string;
        hash: string;
        name: string;
        subName: string;
        author: string;
        mapper: string;
        coverImage: string;
        bpm: number;
        duration: number;
    }
    difficulty: {
        id: number;
        difficultyName: string;
        modename: string;
        stars: number;
        passRating: number;
        accRating: number;
        techRating: number;
    }
}