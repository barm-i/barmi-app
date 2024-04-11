import { Router } from 'express';

// global router for api routes
const router = Router();

export function apiRouter() {
    // set routes
    router.get('/', (req, res) => {
        res.json({ message: 'api route' });
    });

    return router;
}
