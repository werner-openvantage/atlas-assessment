import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
    NODE_ENV: str({ devDefault: testOnly('development'), choices: ['development', 'production', 'test'] }),
    HOST: host({ devDefault: 'localhost' }),
    PORT: port({ devDefault: 4000 }),
    CORS_ORIGIN: str({ devDefault: 'http://localhost:5173' }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 1000 }),
    COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),
    DATABASE_URL: str({ devDefault: 'postgresql://postgres:postgres@localhost:5436/atlas' }),
    SMTP_EMAIL: str({ devDefault: 'hazle.lang66@ethereal.email' }),
    SMTP_PASSWORD: str({ devDefault: 'K9VzKa4YzEVtw1UsyQ&' }),
});

export default env;
