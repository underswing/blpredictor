export interface IPlayerResponseFull {
    id: string;
    name: string;
    platform: string;
    avatar: string;
    country: string;
    bot: boolean;
    pp: number;
    rank: number;
    countryRank: number;
    role: string;
    clanOrder: string;
    accPp: number;
    passPp: number;
    techPp: number;
    allContextsPp: number;
    lastWeekPp: number;
    lastWeekRank: number;
    lastWeekCountryRank: number;
    extensionId: number;
    mapperId: number;
    banned: boolean;
    inactive: boolean;
    externalProfileUrl: string;
    richBioTimeset: number;
    speedrunStart: number;
    scoreStats: {
        rankedPlayCount: number;
    }
}

export interface IRankedMapsResponse {
    data?: {
        metadata: IPageMetadata;
        maps: IBLRankedMap[];
    };
    error?: string;
}

export interface IPPInfo {
    totalPP: number;
    passPP: number;
    accPP: number;
    techPP: number;
}

export interface IBLRankedMap {
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

export interface IPageMetadata {
    page: number;
    count: number;
    total: number;
}

export interface IScoresResponse {
    data: {
        metadata: IPageMetadata;
        data: IScoreCompact[];
    }
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

export type RecentProfile = {
    id: string;
    username: string;
    pfpUrl: string;
    rank: number;
};