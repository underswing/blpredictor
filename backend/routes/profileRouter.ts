import {FastifyInstance} from "fastify";
import {blBaseURL} from "../common/util";

export default function profileRouter(app: FastifyInstance) {
    app.get<{Params: {playerId: string}}>("/:playerId", async (req, reply) => {
        const playerId = req.params.playerId;
        if(!/^\d+$/.test(playerId)) {
            reply.status(400).send({error: "Please provide a valid player ID!"});
            return;
        }
        const blReq = await fetch(`${blBaseURL}/player/${playerId}?stats=true&keepOriginalId=false&leaderboardContext=254`);
        if(blReq.status === 404) {
            reply.status(404).send({error: "Player not found!"});
            return;
        }
        if(blReq.status !== 200) {
            reply.status(400).send({error: "Unknown error: " + blReq.statusText});
            return;
        }
        const data = await blReq.json();
        reply.status(200).send({player: data});
    });
}