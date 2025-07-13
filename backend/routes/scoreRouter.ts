import {blBaseURL} from "../common/util";
import {IBLScoresResponse, IScoreCompact} from "../common/model";
import {FastifyInstance} from "fastify";

const convertToSimplified = (s: IScoreCompact): IScoreCompact => {
    return {
        score: {
            id: s.score.id,
            accuracy: s.score.accuracy,
            badCuts: s.score.badCuts,
            fullCombo: s.score.fullCombo,
            missedNotes: s.score.missedNotes,
            pp: s.score.pp
        },
        leaderboard: {
            id: s.leaderboard.id,
            difficulty: s.leaderboard.difficulty,
            modeName: s.leaderboard.modeName,
            songHash: s.leaderboard.songHash
        }
    }
}

export default function scoreRouter(app: FastifyInstance) {
    app.get<{Querystring: {page?: "string"}, Params: {playerId: string}}>("/:playerId", async (req, reply) => {
        const playerId = req.params.playerId;
        if(!/^\d+$/.test(playerId)) {
            reply.status(400).send({error: "Please provide a valid player ID!"});
            return;
        }

        const page = Number(req.query.page ?? 1);
        if (isNaN(page) || page <= 0) {
            reply.status(400).send({ error: "Invalid page." });
            return;
        }

        const blReq = await fetch(`${blBaseURL}/player/${playerId}/scores/compact?sortBy=pp&order=0&page=${page}&count=100&leaderboardContext=general&type=ranked`);
        if(blReq.status === 404) {
            reply.status(404).send({error: "Player not found!"});
            return;
        }
        if(blReq.status !== 200) {
            reply.status(400).send({error: "Unknown error: " + blReq.statusText});
            return;
        }
        const scoreRes = await blReq.json() as IBLScoresResponse;
        reply.status(200).send({data: {metadata: scoreRes.metadata, data: scoreRes.data.map(convertToSimplified)}});
    });
}
