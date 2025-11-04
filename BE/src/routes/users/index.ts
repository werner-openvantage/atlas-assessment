import express from 'express';
import controller from '@utils/helpers/controller';
import checkEmail from './checkEmail';
import { ControllerParams } from '@/types/general-types';

const usersRouter = express.Router({ mergeParams: true });

usersRouter.get('/check-email', controller(checkEmail, (req): ControllerParams => {
    return {
        // Pass email explicitly because controller() builds a normalized `query` object for GET
        // routes and would overwrite any `query` we set here.
        email: Array.isArray(req.query.email) ? req.query.email[0] : (req.query.email as string | undefined),
    } as any;
}));

export default usersRouter;
