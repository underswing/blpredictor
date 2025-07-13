import {config} from "dotenv";
import indexRouter from "./routes/indexRouter";
import profileRouter from "./routes/profileRouter";
import rankedRouter from "./routes/rankedRouter";
import scoreRouter from "./routes/scoreRouter";
import Fastify from "fastify";
import cors from '@fastify/cors'

config();

const fastify = Fastify({logger: true});

(async () => {
    try {
        await fastify.register(cors);

        fastify.register(indexRouter);
        fastify.register(profileRouter, {prefix: "/profile"});
        fastify.register(rankedRouter, {prefix: "/ranked"});
        fastify.register(scoreRouter, {prefix: "/scores"});

        await fastify.listen({port: parseInt(process.env.PORT || "") || 42004})
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();