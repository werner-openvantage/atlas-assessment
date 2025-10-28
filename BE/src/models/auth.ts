import { type ControllerParams } from '@ts-types/general-types';
import { type ResponseModel } from '@ts-types/response-model';
import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';

export interface VerifyParams extends ControllerParams {}
export interface LoginParams extends ControllerParams {
  body: Login;
}

export interface ResetPasswordParams extends ControllerParams {
  body: ResetPassword;
}

export interface ForgotPasswordParams extends ControllerParams {
  body: ForgotPassword;
}

export interface RegisterParams extends ControllerParams {
  body: Register;
}

export interface LoginData {
  token: string;
  user: {
    userId?: string;
    organizationId?: string;
    type?: string;
    is_archived?: boolean;
  };
  expiresIn: number;
}

export interface VerifyData {
  jwt: string;
}

export interface AuthData {
  success: boolean;
}

export interface VerifyResponse extends ResponseModel {
  data: VerifyData;
}

export interface LoginResponse extends ResponseModel {
  data: LoginData;
}

export interface AuthResponse extends ResponseModel {
  data: AuthData;
}

/**
 *
 */
export class Login {
  @IsEmail()
  email: string;

  @Length(1, 60)
  password: string;

  @IsOptional()
  @IsBoolean()
  keepMeSignedIn: boolean;

  /**
   * The constructor
   */
  constructor(data: Login) {
    this.email = data.email;
    this.password = data.password;
    this.keepMeSignedIn = data.keepMeSignedIn;
  }
}

/**
 * Register Model
 */
export class Register {
  @Length(1, 60)
  password: string;

  @IsEmail()
  email: string;

  @Length(1, 20)
  firstName: string;

  @Length(1, 20)
  lastName: string;

  /**
   * The constructor
   */
  constructor(data: Register) {
    this.password = data.password;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }
}

/**
 *
 */
export class ResetPassword {
  @Length(1, 60)
  password: string;

  /**
   * The constructor
   */
  constructor(data: ResetPassword) {
    this.password = data.password;
  }
}

/**
 *
 */
export class ForgotPassword {
  @IsEmail()
  email: string;

  /**
   * The constructor
   */
  constructor(data: ForgotPassword) {
    this.email = data.email;
  }
}
