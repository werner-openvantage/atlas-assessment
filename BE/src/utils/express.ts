import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './env';

const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '6mb' }));

const corsOptions = {
    methods: 'GET,PATCH,POST,DELETE',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    origin: [env.CORS_ORIGIN, 'http://localhost:5173'],
    allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors(corsOptions));

export default app;
