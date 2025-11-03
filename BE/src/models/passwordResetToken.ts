import { IsDate, IsBoolean, Length, IsUUID } from 'class-validator'
import notNull from '@/utils/helpers/notNull'
import dayjs from 'dayjs'

export class PasswordResetToken {
    @IsUUID()
    id?: string

    @Length(1, 250)
    user_id?: string

    @Length(1, 500)
    token?: string

    @IsDate()
    expires_at?: Date

    @IsBoolean()
    used?: boolean

    @IsDate()
    created_at?: Date

    @IsDate()
    updated_at?: Date

    constructor(data: any = {}) {
        if (notNull(data.user_id)) {
            this.user_id = data.user_id
        }
        if (notNull(data.token)) {
            this.token = data.token
        }
        if (notNull(data.expires_at)) {
            this.expires_at = dayjs(data.expires_at).toDate()
        }
        if (notNull(data.used)) {
            this.used = data.used
        }
    }
}

export default PasswordResetToken
