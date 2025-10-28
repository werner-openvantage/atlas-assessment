import Authentication from '@/middleware/authentication';
import controller from '@/utils/helpers/controller';
import express from 'express';
import updateUser from './updateUser';
import { ControllerParams } from '@/types/general-types';
import getProfile from './profile';


const userRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: Invalid user data or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.put('/:id', Authentication(), controller(updateUser, (req): ControllerParams => {
  return {
    body: req.body as object,
    id: req.params.id,
  };
}));

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/', Authentication(), controller(getProfile, (req): ControllerParams => {
  return {
    user: req.user,
  };
}));

export default userRouter;
