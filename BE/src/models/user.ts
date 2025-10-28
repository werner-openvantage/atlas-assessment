import type { ResponseModel } from '@/types/response-model';
import notNull from '@/utils/helpers/notNull';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsUUID, Length } from 'class-validator';
import dayjs from 'dayjs';
import Title from './enums/title';

export interface SuperUser extends User {
  is_superuser: boolean;
  is_dealer: boolean;
}

export interface UserResponse extends ResponseModel {
  data: User;
}

export interface GetUsersResponse extends ResponseModel {
  data: User[];
}

export interface UserArchivedStatusResponseModel extends ResponseModel {
  is_archived: boolean | undefined;
  id: string | undefined;
}

/**
 * User Model
 * @category User
 * @subcategory DB Model
 * @example
 * const user = new User(data)
 */
export class User {
  // PK VARCHAR(250) NN id
  @Length(1, 250)
  id?: string;

  /**
   * VARCHAR(250) NN username
   */
  @IsEmail()
  email?: string;

  /**
   * CHAR(60) NN password MySQL can hash/salt this?
   */
  // @IsOptional()
  @Length(1, 60)
  password?: string;

  // TODO moved from driver/employee table?
  /**
   * Text title
   */
  @IsOptional()
  @IsEnum(Title)
  title?: typeof Title;

  /**
   * Text NN first_name
   */
  @Length(1, 20)
  first_name?: string;

  /**
   * Text middle_name
   */
  @IsOptional()
  middle_name?: string;

  /**
   * Text NN last_name
   */
  @Length(1, 20)
  last_name?: string;

  // ENUM user_type
  @IsBoolean()
  is_super_admin?: boolean;

  /**
   * VARCHAR(250) organization
   */
  @IsUUID('all')
  organization_id?: string;

  /**
   * TINYINT NN locked
   */
  @IsOptional()
  @IsBoolean()
  is_archived: boolean = false;

  // Date created
  @IsOptional()
  @IsDate()
  created_at?: Date;

  // Date updated
  @IsOptional()
  @IsDate()
  updated_at?: Date;

  constructor(data: any, { filter = false, update = false } = {}) {
    if (notNull(data.email)) {
      this.email = data.email;
    }
    if (notNull(data.password)) {
      this.password = data.password;
    }
    if (notNull(data.title)) {
      this.title = data.title;
    }
    if (notNull(data.first_name)) {
      this.first_name = data.first_name;
    }
    if (notNull(data.middle_name)) {
      this.middle_name = data.middle_name;
    }
    if (notNull(data.last_name)) {
      this.last_name = data.last_name;
    }
    if (notNull(data.is_archived)) {
      this.is_archived = data.is_archived;
    }
    if (notNull(data.organization_id)) {
      this.organization_id = data.organization_id;
    }
    if (notNull(data.is_super_admin)) {
      this.is_super_admin = data.is_super_admin;
    }
    if (update) {
      this.updated_at = dayjs().toDate();
    }
    if (filter) {
      if (notNull(data.created_at)) {
        if (Array.isArray(data.created_at)) {
          this.created_at = dayjs(data.created_at[0]).toDate();
        } else {
          this.created_at = dayjs(data.created_at).toDate();
        }
      }
      if (notNull(data.updated_at)) {
        if (Array.isArray(data.updated_at)) {
          this.updated_at = dayjs(data.updated_at[0]).toDate();
        } else {
          this.updated_at = dayjs(data.updated_at).toDate();
        }
      }
    }
  }
}

export default User;
