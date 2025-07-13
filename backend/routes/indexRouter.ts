import {FastifyInstance} from "fastify";


export default function indexRouter(app: FastifyInstance) {
    app.get("/", (_req, reply) => {
        return reply.status(200).send({message: "Server Operational!"});
    });
}