import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { toast } from 'react-toastify';
import accountApis from '../api/account-api';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UserDto,
} from '../models/User';
import { UserAbout } from '../models/UserProfile';
import { history } from '../utils/route';
import { store } from './store';

const TOKEN_KEY = 'access_token';
const REFESH_LAST_TIME_KEY = 'last_refresh_at';
const TIME_REFRESH_TOKEN = 30; // seconds

window.addEventListener('storage', (e) => {
  if (e.key === TOKEN_KEY && e.newValue !== e.oldValue) {
    store.userStore.readUserFromLocalStorage(e.newValue);

    if (e.newValue && e.oldValue) {
      const newUser: UserDto = JSON.parse(e.newValue);
      const oldUser: UserDto = JSON.parse(e.oldValue);
      store.userStore.broadcastUserInfoAfterUpdateUser(oldUser, newUser);
    }
  }
});

function getExpiredTime(token: string | null | undefined) {
  if (!token) return undefined;
  const tokens = token.split('.');
  if (tokens.length > 1) {
    return new Date(JSON.parse(atob(tokens[1])).exp * 1000);
  }
  return undefined;
}

export default class UserStore {
  user?: UserDto;
  facebookAccessToken?: string;
  facebookLoading = false;
  userLoading = false;
  refreshSchedulerTimer?: number;

  constructor() {
    makeAutoObservable(this);
    this.readUserFromLocalStorage();
    this.checkAndRefreshTokenIfNeeded(true);
  }

  get isLoggedIn() {
    return !!this.user?.token;
  }

  private clearStorageAndRedirectToHomePage = () => {
    this.setUser(undefined);
    if (window.location.pathname !== '/') history.push('/');
  };

  readUserFromLocalStorage = (val?: string | null | undefined) => {
    if (val === undefined) {
      val = localStorage.getItem(TOKEN_KEY);
    }
    this.user = JSON.parse(val!) || undefined;
    if (!this.user) {
      if (window.location.pathname !== '/') history.push('/');
    }
  };

  private setUser = (user?: UserDto, hasTokenChange: boolean = true) => {
    const oldUser = this.user;
    this.user = user;
    if (this.user) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(this.user));
      if (hasTokenChange) this.scheduleToRefreshToken();
      this.broadcastUserInfoAfterUpdateUser(oldUser, this.user);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      this.clearRefreshSchedulerTimer();
    }
  };

  broadcastUserInfoAfterUpdateUser = (oldUser?: UserDto, newUser?: UserDto) => {
    if (newUser?.image && newUser.image !== oldUser?.image) {
      store.profileStore.updateProfileMainPhoto(newUser.image);
      store.activityStore.updateActivitiesMainPhoto();
    }
    if (newUser && newUser.displayName !== oldUser?.displayName) {
      store.profileStore.setDisplayName(newUser.displayName);
      store.activityStore.updateProfileAbout({
        displayName: newUser.displayName,
      });
    }
  };

  private setUserLoading = (val: boolean) => {
    this.userLoading = val;
  };

  private setFacebookLoading = (val: boolean) => {
    this.facebookLoading = val;
  };

  private setFacebookAccessToken = (val?: string) => {
    this.facebookAccessToken = val;
  };

  login = async (loginModel: LoginDto) => {
    const user = await accountApis.login(loginModel);
    this.setUser(user);
  };

  facebookLogin = (callback?: (user: UserDto) => void) => {
    const callFacebookLoginApi = () => {
      accountApis
        .facebookLogin(this.facebookAccessToken!)
        .then((user) => {
          this.setUser(user);
          if (callback) callback(user);
        })
        .finally(() => {
          this.setFacebookLoading(false);
        });
    };

    this.setFacebookLoading(true);
    if (this.facebookAccessToken) {
      callFacebookLoginApi();
    } else {
      FB.login(
        (response: fb.StatusResponse) => {
          if (response.authResponse?.accessToken) {
            this.setFacebookAccessToken(response.authResponse.accessToken);
            callFacebookLoginApi();
          } else {
            this.setFacebookLoading(false);
          }
        },
        { scope: 'public_profile,email' }
      );
    }
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

  private clearRefreshSchedulerTimer = () => {
    if (this.refreshSchedulerTimer) {
      window.clearTimeout(this.refreshSchedulerTimer);
      this.refreshSchedulerTimer = undefined;
    }
  };

  private checkAndRefreshTokenIfNeeded = async (trackUserLoading: boolean) => {
    if (!this.user?.token) return;

    const tokenExp = getExpiredTime(this.user.token);
    const refreshTokenExp = getExpiredTime(this.user.refreshToken);
    const now = Date.now();
    if (refreshTokenExp!.getTime() - now <= 2 * 1000) {
      toast.error('Session expired - please login again.');
      return this.clearStorageAndRedirectToHomePage();
    }

    if (tokenExp!.getTime() - now <= TIME_REFRESH_TOKEN * 1000 + 500) {
      const lastRefreshTime = new Date(
        +localStorage.getItem(REFESH_LAST_TIME_KEY)!
      );
      if (now - lastRefreshTime.getTime() > 5 * 1000) {
        try {
          localStorage.setItem(REFESH_LAST_TIME_KEY, now.toString());
          await this.refreshToken(trackUserLoading);
        } finally {
          localStorage.removeItem(REFESH_LAST_TIME_KEY);
        }
      }
    } else {
      this.scheduleToRefreshToken();
    }
  };

  private scheduleToRefreshToken = () => {
    this.clearRefreshSchedulerTimer();
    const tokenExp = getExpiredTime(this.user?.token);
    if (!tokenExp) return;

    const timeToCallRefreshApi = tokenExp.getTime() - TIME_REFRESH_TOKEN * 1000;
    if (timeToCallRefreshApi >= Date.now()) {
      this.refreshSchedulerTimer = window.setTimeout(
        () => this.checkAndRefreshTokenIfNeeded(false),
        timeToCallRefreshApi - Date.now()
      );
    }
  };

  private refreshToken = async (trackUserLoading: boolean) => {
    if (trackUserLoading) this.setUserLoading(true);
    try {
      const user = await accountApis.refreshToken(this.user?.refreshToken!);
      this.setUser(user);
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 400)
        this.clearStorageAndRedirectToHomePage();
      else console.log(err);
    } finally {
      if (trackUserLoading) this.setUserLoading(false);
    }
  };

  updateMainPhoto = (image: string) => {
    if (!this.user) return;
    this.user.image = image;
    this.setUser(this.user, false);
  };

  updateProfileAbout(data: UserAbout) {
    if (!this.user) return;
    this.user.displayName = data.displayName;
    this.setUser(this.user, false);
  }
}
