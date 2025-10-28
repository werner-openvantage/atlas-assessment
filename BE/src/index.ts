import env from './utils/env';
import app from './utils/express';
import authRouter from './routes/auth';
import ViteExpress from 'vite-express';
import userRouter from './routes/user';
import postsRouter from './routes/posts';
import errorHandler from './middleware/errorHandler';
import { setupSwagger } from './utils/swagger';

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Setup Swagger documentation
setupSwagger(app);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/posts', postsRouter);

app.use(errorHandler);

ViteExpress.listen(app, env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    console.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
    console.info('sigint received, shutting down');
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
