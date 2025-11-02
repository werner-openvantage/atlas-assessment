import express from 'express';
import controller from '@utils/helpers/controller';
import checkEmail from './checkEmail';
import { ControllerParams } from '@/types/general-types';

const usersRouter = express.Router({ mergeParams: true });

usersRouter.get('/check-email', controller(checkEmail, (req): ControllerParams => {
    return {
        query: req.query as object,
    };
}));

export default usersRouter;
