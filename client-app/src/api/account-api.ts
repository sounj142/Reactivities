import { ChangePasswordDto, LoginDto, RegisterDto } from '../models/User';
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
  register: (registerModel: RegisterDto) =>
    requests.post<RegisterDto, UserDto>(
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
};

export default accountApis;
