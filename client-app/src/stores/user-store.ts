import { makeAutoObservable } from 'mobx';
import userApis from '../api/user-api';
import { LoginDto, RegisterDto, UserDto } from '../models/User';

const tokenKey = 'jwt';
export default class UserStore {
  user?: UserDto = JSON.parse(localStorage.getItem(tokenKey)!) || undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user?.token;
  }

  setUser = (user?: UserDto) => {
    this.user = user;
    if (user) localStorage.setItem(tokenKey, JSON.stringify(user));
    else localStorage.removeItem(tokenKey);
  };

  login = async (loginModel: LoginDto) => {
    const user = await userApis.login(loginModel);
    this.setUser(user);
  };

  logOut = () => {
    this.setUser(undefined);
  };

  register = async (registerModel: RegisterDto) => {
    const user = await userApis.register(registerModel);
    this.setUser(user);
  };

  getCurrentUser = async () => {
    const user = await userApis.getCurrentUser();
    this.setUser(user);
  };
}
