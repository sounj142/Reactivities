import { makeAutoObservable } from 'mobx';
import accountApis from '../api/account-api';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UserDto,
} from '../models/User';
import { UserAbout } from '../models/UserProfile';

const tokenKey = 'jwt';
export default class UserStore {
  user?: UserDto = JSON.parse(localStorage.getItem(tokenKey)!) || undefined;
  facebookLoading = false;

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

  private setFacebookLoading = (val: boolean) => {
    this.facebookLoading = val;
  };

  login = async (loginModel: LoginDto) => {
    const user = await accountApis.login(loginModel);
    this.setUser(user);
  };

  facebookLogin = (callback?: (user: UserDto) => void) => {
    const callFacebookLoginApi = (accessToken: string) => {
      accountApis
        .facebookLogin(accessToken)
        .then((user) => {
          this.setUser(user);
          if (callback) callback(user);
        })
        .finally(() => {
          this.setFacebookLoading(false);
        });
    };

    this.setFacebookLoading(true);
    FB.getLoginStatus((res) => {
      if (res.status === 'connected' && res.authResponse?.accessToken) {
        callFacebookLoginApi(res.authResponse.accessToken);
      } else {
        FB.login(
          (response: fb.StatusResponse) => {
            if (response.authResponse?.accessToken) {
              callFacebookLoginApi(response.authResponse.accessToken);
            } else {
              this.setFacebookLoading(false);
            }
          },
          { scope: 'public_profile,email' }
        );
      }
    });
  };

  logOut = () => {
    this.setUser(undefined);
  };

  register = async (registerModel: RegisterDto) => {
    const user = await accountApis.register(registerModel);
    this.setUser(user);
  };

  changePassword = async (model: ChangePasswordDto) => {
    const user = await accountApis.changePassword(model);
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
