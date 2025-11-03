import db from '@/utils/knex'
import { hash } from 'bcryptjs'
import crypto from 'crypto'
import dayjs from 'dayjs'

const Knex = db()

/**
 * Create a password reset token
 * @param {string} userId - User ID
 * @returns {Promise<{token: string, expiresAt: Date}>} Reset token and expiration
 */
export const createPasswordResetToken = async (userId: string): Promise<{ token: string; expiresAt: Date }> => {
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex')

    // Set expiration to 1 hour from now
    const expiresAt = dayjs().add(1, 'hour').toDate()

    await Knex('password_reset_tokens').insert({
        user_id: userId,
        token,
        expires_at: expiresAt,
        used: false
    })

    return { token, expiresAt }
}

/**
 * Verify and use a password reset token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password (hashed)
 * @returns {Promise<boolean>} Success status
 */
export const verifyAndResetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    const resetToken = await Knex('password_reset_tokens')
        .where({ token })
        .where('expires_at', '>', dayjs().toDate())
        .where('used', false)
        .first()

    if (!resetToken) {
        throw new Error('Invalid or expired password reset token')
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10)

    // Update the user's password and mark token as used
    await Knex('users').where('id', resetToken.user_id).update({ password: hashedPassword })
    await Knex('password_reset_tokens').where('id', resetToken.id).update({ used: true })

    // Invalidate all other tokens for this user
    await Knex('password_reset_tokens')
        .where('user_id', resetToken.user_id)
        .where('id', '!=', resetToken.id)
        .update({ used: true })

    return true
}

/**
 * Get user by password reset token
 * @param {string} token - Reset token
 * @returns {Promise<any>} User object
 */
export const getUserByResetToken = async (token: string): Promise<any> => {
    const resetToken = await Knex('password_reset_tokens')
        .where({ token })
        .where('expires_at', '>', dayjs().toDate())
        .where('used', false)
        .first()

    if (!resetToken) {
        throw new Error('Invalid or expired password reset token')
    }

    const user = await Knex('users').where('id', resetToken.user_id).first()
    return user
}

/**
 * Cleanup expired tokens
 * @returns {Promise<number>} Number of tokens deleted
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
    return await Knex('password_reset_tokens')
        .where('expires_at', '<', dayjs().toDate())
        .where('used', false)
        .delete()
}

export default {
    createPasswordResetToken,
    verifyAndResetPassword,
    getUserByResetToken,
    cleanupExpiredTokens
}
