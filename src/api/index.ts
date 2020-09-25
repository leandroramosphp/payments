import { Router } from 'express';
import email from './routes/email';

export default () => {
    const app = Router();
    email(app);
    return app;
}