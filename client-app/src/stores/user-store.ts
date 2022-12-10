import { makeAutoObservable } from 'mobx';
import accountApis from '../api/account-api';
import { LoginDto, RegisterDto, UserDto } from '../models/User';
import { UserAbout } from '../models/UserProfile';

const tokenKey = 'jwt';
export default class UserStore {
  user?: UserDto = JSON.parse(localStorage.getItem(tokenKey)!) || undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user?.token;
  }

  private setUser = (user?: UserDto) => {
    this.user = user;
    if (user) localStorage.setItem(tokenKey, JSON.stringify(user));
    else localStorage.removeItem(tokenKey);
  };

  login = async (loginModel: LoginDto) => {
    const user = await accountApis.login(loginModel);
    this.setUser(user);
  };

  logOut = () => {
    this.setUser(undefined);
  };

  register = async (registerModel: RegisterDto) => {
    const user = await accountApis.register(registerModel);
    this.setUser(user);
  };

  updateMainPhoto = (image: string) => {
    if (!this.user) return;
    this.user.image = image;
    this.setUser(this.user);
  };

  updateProfileAbout(data: UserAbout) {
    if (!this.user) return;
    this.user.displayName = data.displayName;
    this.setUser(this.user);
  }
}
