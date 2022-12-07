import { LoginDto, RegisterDto } from './../models/User';
import { UserDto } from '../models/User';
import { ignoreStatusCodes } from '../utils/axios';
import { requests } from './agent';

const basePath = '/account';
const userApis = {
  getCurrentUser: () => requests.get<UserDto>(`${basePath}/current-user`),
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
};

export default userApis;
