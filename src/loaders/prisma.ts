import { PrismaClient } from '@prisma/client';
import logger from '../loaders/logger';

var prismaLoader = new PrismaClient({
    rejectOnNotFound: false,
    log: [
        {
            emit: "event",
            level: "query",
        }
    ]
});

prismaLoader.$on('query', e => {
    logger.silly("Query: " + e.query)
    logger.silly("Params: " + e.params)
    logger.silly("Duration: " + e.duration + "ms")
})

export default prismaLoader;