import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
} from '../models/User';
import { UserDto } from '../models/User';
import { ignoreStatusCodes } from '../utils/axios';
import { requests } from './agent';

const basePath = '/account';
const accountApis = {
  login: (loginModel: LoginDto) =>
    requests.post<LoginDto, UserDto>(
      `${basePath}/login`,
      loginModel,
      ignoreStatusCodes()
    ),
  resendConfirmationEmail: (email: string) =>
    requests.post<{ email: string }, void>(
      `${basePath}/send-confirmation-email`,
      { email },
      ignoreStatusCodes()
    ),
  verifyEmail: (model: VerifyEmailDto) =>
    requests.post<VerifyEmailDto, void>(
      `${basePath}/verify-email`,
      model,
      ignoreStatusCodes()
    ),
  register: (registerModel: RegisterDto) =>
    requests.post<RegisterDto, void>(
      `${basePath}/register`,
      registerModel,
      ignoreStatusCodes()
    ),
  changePassword: (model: ChangePasswordDto) =>
    requests.put<ChangePasswordDto, UserDto>(
      `${basePath}/change-password`,
      model,
      ignoreStatusCodes()
    ),
  facebookLogin: (accessToken: string) =>
    requests.post<undefined, UserDto>(`${basePath}/facebook-login`, undefined, {
      params: { accessToken },
    }),
  refreshToken: (refreshToken: string) =>
    requests.post<{ refreshToken: string }, UserDto>(
      `${basePath}/refresh-token`,
      { refreshToken },
      ignoreStatusCodes()
    ),
};

export default accountApis;
