import errorHandler from '@middleware/errorHandler';
import controller from '@utils/helpers/controller';

import Authentication from '@middleware/authentication';
import {
  Register,
  RegisterParams,
  type ForgotPassword,
  type ForgotPasswordParams,
  type Login,
  type LoginParams,
  type ResetPassword,
  type ResetPasswordParams
} from '@models/auth';
import { type RequestModel } from '@ts-types/request';
import express from 'express';
import forgotPassword from './forgotPassword';
import login from './login';
import requestPasswordReset from './requestPasswordReset';
import registerUser from './register';

const authRouter = express.Router({ mergeParams: true});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid login details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(
  '/login',
  controller(login, (req: RequestModel): LoginParams => {
    return {
      body: req.body as Login,
    };
  }),
);

/**
 * @swagger
 * /auth/valid:
 *   get:
 *     summary: Validate authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationSuccess'
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.get('/valid', Authentication(), (req: RequestModel, res) => {
  const userType = req.user?.is_super_admin ? 'super_admin' : 'user';
  res.status(200).json({ success: true, userType });
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *       400:
 *         description: Invalid email or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(
  '/forgot-password',
  controller(requestPasswordReset, (req: RequestModel): ForgotPasswordParams => {
    return {
      body: req.body as ForgotPassword,
    };
  }),
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid data or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(
  '/register',
  controller(registerUser, (req: RequestModel): RegisterParams => {
    return {
      body: req.body as Register,
    };
  }),
);

/**
 * @swagger
 * /auth/forgot-password/{id}:
 *   patch:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *       400:
 *         description: Invalid token or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.patch(
  '/forgot-password/:id',
  controller(forgotPassword, (req: RequestModel): ResetPasswordParams => {
    return {
      body: req.body as ResetPassword,
      id: req.params.id,
    };
  }),
);

// Register error handler after all routes
authRouter.use(errorHandler);

export default authRouter;
