import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import env from './env';

const app = express();
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '6mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    origin: (incomingOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!incomingOrigin) return callback(null, true);

        const allowedOrigins = [env.CORS_ORIGIN, 'http://localhost:5173'];
        const allowLocalhostWildcard = typeof env.CORS_ORIGIN === 'string' && env.CORS_ORIGIN.includes('localhost') && env.CORS_ORIGIN.includes('*');

        if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
        if (allowLocalhostWildcard && /^https?:\/\/localhost:\d+$/.test(incomingOrigin)) return callback(null, true);

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
};

app.use(cors(corsOptions));

export default app;
