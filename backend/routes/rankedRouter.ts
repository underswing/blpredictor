import * as fs from "node:fs";
import {IBLRankedLeaderboard, IBLLeaderboardsResponse, IMapCache} from "../common/model";
import {getBlRankedURL} from "../common/util";
import {FastifyInstance} from "fastify";

const CACHE_FILE = "./cache/ranked_maps.json";
const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

const loadCache = (): IMapCache => {
    if(fs.existsSync(CACHE_FILE)) {
        return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }
    return {lastFetch: 0, maps: []};
}

const convertToSimplifiedMap = (l: IBLRankedLeaderboard): IBLRankedLeaderboard => {
    return {
        id: l.id,
        ppInfo: {accPP: 0, passPP: 0, techPP: 0, totalPP: 0},
        potentialWeighted: 0,
        potentialWeightedChange: 0,
        song: {id: l.song.id, hash: l.song.hash, name: l.song.name, subName: l.song.subName, author: l.song.author, bpm: l.song.bpm, coverImage: l.song.coverImage, duration: l.song.duration, mapper: l.song.mapper},
        difficulty: {id: l.difficulty.id, difficultyName: l.difficulty.difficultyName, stars: l.difficulty.stars, accRating: l.difficulty.accRating, modename: l.difficulty.modename, passRating: l.difficulty.passRating, techRating: l.difficulty.techRating}
    };
}

const saveCache = (leaderboards: IBLRankedLeaderboard[]) => {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({lastFetch: Date.now(), maps: leaderboards}))
}

const fetchRankedMaps = async() => {
    const res = await fetch(getBlRankedURL(1, 9999));
    if(!res.ok) {
        throw Error("BL API Error: " + res.statusText);
    }
    const data = await res.json() as IBLLeaderboardsResponse;
    const simplifiedMaps: IBLRankedLeaderboard[] = data.data.map(convertToSimplifiedMap);
    saveCache(simplifiedMaps);
    return simplifiedMaps;
}

export default function rankedRouter(app: FastifyInstance) {
    app.get<{Querystring: {page?: "string", count?: "string"}}>('/', async (req, reply) => {
        const page = Number(req.query.page ?? "1");
        const count = Number(req.query.count ?? "16");

        if (isNaN(page) || isNaN(count) || page <= 0 || count <= 0) {
            reply.status(400).send({ error: "Invalid page or count value." });
            return;
        }

        const cache = loadCache();
        let maps = cache.maps;

        if(Date.now() - cache.lastFetch > CACHE_EXPIRY || maps.length === 0) {
            try {
                console.log("Fetching all ranked maps from BeatLeader...");
                maps = await fetchRankedMaps();
                console.log("Done!");
            } catch(err) {
                console.error("Error while trying to fetch BL leaderboards!", err);
                reply.status(500).send({error: "Failed to fetch ranked maps."});
            }
        }

        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const paginatedMaps = maps.slice(startIndex, endIndex);

        reply.status(200).send({
            data: {
                metadata: {
                    page: page,
                    count: count,
                    total: maps.length
                },
                maps: paginatedMaps
            }
        });
    });
}