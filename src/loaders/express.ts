import express, { Router, Application } from 'express';
import cors from 'cors';

import logger from '../loaders/logger';

import routesMos from '../api/routes/mos';
import routesMosStore from '../api/routes/mosStore';

export default async ({ app }: { app: Application }) => {
    app.use(cors());

    app.use(express.json());

    const router = Router();

    app.use('/', routesMos(router));
    app.use('/', routesMosStore(router));
    // app.use(config.api.root + config.api.version + config.api.prefix, routes(router));

    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            logger.error(err.message)
            return res
                .status(err.status)
                .send({ message: "Erro no back-end, por favor reporte o problema para o desenvolvedor responsável." })
                .end();
        }
        return next(err);
    });

    app.use((err, req, res, next) => {
        if (err.status === undefined || err.status === 500) {
            return res.status(500).json({
                errors: {
                    message: "Erro no back-end, por favor reporte o problema para o desenvolvedor responsável."
                }
            })
        }
        if (err.data && err.status) {
            return res.status(err.status).json(err.data);
        }

        if ((err.code || err.status) && err.message) {
            return res.status(err.status).json({ message: err.message, status: err.status, code: err.code });
        }

        return res.status(500).json({
            errors: {
                message: "Erro no back-end, por favor reporte o problema para o desenvolvedor responsável."
            }
        })
    });
};