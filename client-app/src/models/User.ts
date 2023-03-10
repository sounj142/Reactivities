export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  userName: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserDto {
  email: string;
  userName: string;
  displayName: string;
  image?: string;
  isEmptyCredential: boolean;
  token: string;
  refreshToken: string;
}

export interface VerifyEmailDto {
  token: string;
  email: string;
}
