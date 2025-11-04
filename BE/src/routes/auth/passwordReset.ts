import express, { Request, Response } from 'express'
import db from '@/utils/knex'
import {
    createPasswordResetToken,
    verifyAndResetPassword,
    getUserByResetToken
} from '@/controllers/passwordReset'
import ValidationError from '@/errors/validationError'
import nodemailer from 'nodemailer'

const router = express.Router()
const Knex = db()

/**
 * POST /auth/forgot-password
 * Initiate password reset by sending a reset email
 * @param {string} email - User email address
 * @returns {object} Success message
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        // Validation
        if (!email) {
            throw new ValidationError('Email is required')
        }

        // Find user by email
        const user = await Knex('users').where({ email }).first()
        if (!user || user.is_archived) {
            // Don't reveal if email exists for security
            return res.json({ success: true, message: 'If an account exists, a password reset email will be sent' })
        }

        // Create password reset token
        const { token } = await createPasswordResetToken(user.id)

        // Build reset link
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`

        // Send email
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Request',
                html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>Or copy this link: ${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `
            })
        } catch (emailError) {
            console.error('Email sending failed:', emailError)
            // Don't fail the request, but log the error
        }

        res.json({ success: true, message: 'If an account exists, a password reset email will be sent' })
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ success: false, message: (error as ValidationError).message })
        } else {
            console.error('Forgot password error:', error)
            res.status(500).json({ success: false, message: 'Failed to process password reset request' })
        }
    }
})

/**
 * GET /auth/verify-reset-token
 * Verify if a password reset token is valid
 * @param {string} token - Reset token from query
 * @returns {object} User email if valid
 */
router.get('/verify-reset-token', async (req: Request, res: Response) => {
    try {
        const { token } = req.query

        if (!token || typeof token !== 'string') {
            throw new ValidationError('Invalid token')
        }

        const user = await getUserByResetToken(token)
        res.json({ success: true, email: user.email })
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Invalid token' })
    }
})

/**
 * POST /auth/reset-password
 * Reset user password using valid token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {object} Success message
 */
router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { token, newPassword, confirmPassword } = req.body

        // Validation
        if (!token || !newPassword || !confirmPassword) {
            throw new ValidationError('Token, password, and confirmation are required')
        }

        if (newPassword !== confirmPassword) {
            throw new ValidationError('Passwords do not match')
        }

        if (newPassword.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long')
        }

        // Password strength check - should contain uppercase, lowercase, number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(newPassword)) {
            throw new ValidationError('Password must contain uppercase, lowercase, and numbers')
        }

        // Verify token and reset password
        await verifyAndResetPassword(token, newPassword)

        res.json({ success: true, message: 'Password has been reset successfully' })
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ success: false, message: (error as ValidationError).message })
        } else {
            console.error('Reset password error:', error)
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Failed to reset password' })
        }
    }
})

export default router
