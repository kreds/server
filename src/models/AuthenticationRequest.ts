export enum AuthenticationRequestType {
  PASSWORD = 'password',
  OAUTH2 = 'oauth2',
  EXTENSION = 'extension',
}

export enum AuthenticationRequestPasswordSubtype {
  BCRYPT = 'bcrypt',
}

export interface AuthenticationRequest {
  type: AuthenticationRequestType;
  username: string;
  subtype: string;
  data: any;
}

export interface AuthenticationRequestPassword extends AuthenticationRequest {
  type: AuthenticationRequestType.PASSWORD;
  subtype: AuthenticationRequestPasswordSubtype;
  data: string;
}

export interface AuthenticationRequestOAuth2 extends AuthenticationRequest {
  type: AuthenticationRequestType.OAUTH2;
  subtype: string;
  data: any;
}

export interface AuthenticationRequestExtension extends AuthenticationRequest {
  type: AuthenticationRequestType.EXTENSION;
  subtype: string;
  data: any;
}

export type AuthenticationRequestUnion =
  | AuthenticationRequest
  | AuthenticationRequestPassword
  | AuthenticationRequestOAuth2
  | AuthenticationRequestExtension;
