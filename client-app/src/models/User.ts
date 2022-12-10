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

export interface UserDto {
  email: string;
  userName: string;
  displayName: string;
  image?: string;
  token: string;
}
