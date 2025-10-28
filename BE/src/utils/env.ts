import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
    NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
    HOST: host({ devDefault: testOnly('localhost') }),
    PORT: port({ devDefault: testOnly(3000) }),
    CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
    COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
    DATABASE_URL: str({ devDefault: testOnly('postgresql://postgres:postgres@localhost:5432/postgres') }),
    SMTP_EMAIL: str({ devDefault: testOnly('example@email.com') }),
    SMTP_PASSWORD: str({ devDefault: testOnly('password') }),
});

export default env;
