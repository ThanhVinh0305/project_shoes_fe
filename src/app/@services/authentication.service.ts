import { Injectable, inject } from "@angular/core";
import { ChangePasswordBody, LoginBody, LoginResponse, RegisterBody, User } from "../@core/models/auth.model";
import { HttpService } from "./http.service";
import { BehaviorSubject, firstValueFrom, map, pipe } from "rxjs";
import { Router } from "@angular/router";
import { BaseComponent } from "../@core/base/base.component";
import { MessagesService } from "./message.service";
import { ROLE_ADMIN } from "../@core/constants/constant";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly httpService = inject(HttpService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessagesService);
  public static readonly STORAGE_ACCESS_TOKEN = 'access_token';
  public static readonly STORAGE_REFRESH_TOKEN = 'refresh_token';
  public static readonly STORAGE_EXPIRES_IN = 'expires_in';
  currentUser: User | undefined = undefined;

  private readonly currentUser$ = new BehaviorSubject<User | undefined>(undefined);

  getCurrentUserObservable() {
    return this.currentUser$.asObservable();
  }

  saveToken(result: LoginResponse) {
    if (result.access_token) {
      localStorage.setItem(AuthenticationService.STORAGE_ACCESS_TOKEN, result.access_token);
    }
    if (result.refresh_token) {
      localStorage.setItem(AuthenticationService.STORAGE_REFRESH_TOKEN, result.refresh_token);
    }
    if (result.expires_in) {
      localStorage.setItem(AuthenticationService.STORAGE_EXPIRES_IN, result.expires_in);
    }
    if (result.user_info) {
      this.saveUser(result.user_info);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(AuthenticationService.STORAGE_ACCESS_TOKEN);
  }

  clearToken() {
    localStorage.clear();
    this.currentUser = undefined;
  }

  saveUser(user: User) {
    this.currentUser = user;
    this.currentUser$.next(user);
  }

  calculateExpiresIn() {
    const expires_in = localStorage.getItem(AuthenticationService.STORAGE_EXPIRES_IN);
    if (!expires_in) {
      return 0;
    }
    const date = new Date().getTime();
    const expiresDate = new Date(expires_in).getTime();
    const time = (expiresDate - date) / 60;
    if (time > 0 && time < 5) {
      this.getNewAccessToken();
    }
    return time;
  }

  async getNewAccessToken() {
    try {
      const refreshToken = localStorage.getItem(AuthenticationService.STORAGE_REFRESH_TOKEN);
      if (refreshToken) {
        const loginResponse: LoginResponse = await firstValueFrom(this.httpService.post('/auth/refresh-login', {
          data: {
            token: refreshToken
          }
        }).pipe(
          map(result => result.data)
        ));
        this.saveToken(loginResponse);
      }
    } catch (error) {
    }
  }

  login(data: LoginBody, currentUrl?: string) {
    // Đảm bảo không gửi null lên backend
    const payload: LoginBody = {
      username: data.username?.trim() || '',
      password: data.password || ''
    };

    if (!payload.username || !payload.password) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Tên đăng nhập và mật khẩu không được bỏ trống'
      });
      return;
    }

    this.httpService.post('/auth/login', { data: payload, ignoreAuthToken: true })
    .pipe(map(result => result.data))
    .subscribe((res: LoginResponse) => {
      this.saveToken(res);
      if (this.currentUser) {
        if (this.currentUser.roles?.length) {
          console.log(this.currentUser);
          if (this.currentUser.roles[0].name === ROLE_ADMIN) {
            this.router.navigate(['/admin/product-management']);
            return;
          }
          if (currentUrl) {
            console.log(currentUrl);
            this.router.navigate([currentUrl]);
            return;
          }
          this.router.navigate(['/']);
        }
      }
    });
  }

  logout(router: Router) {
    this.httpService.post('/api/v1/auth/logout', { data: null }).subscribe(() => {
      this.clearToken();
      this.currentUser$.next(undefined);
      this.router.navigate(['/']);
    })
  }

  register(register: RegisterBody) {
    this.httpService.post('/auth/register', { data: register })
      .pipe(
        map(result => result.data)
      )
      .subscribe((user: User) => {
        this.messageService.showMessage({
          detail: 'Đăng ký tài khoản thành công.'
        })
        this.router.navigate(['/login']);
      });
  }

  changePassword(data: ChangePasswordBody) {
    this.httpService.post('/api/v1/auth/change-password', { data: data }).pipe(map(res => res.data)).subscribe(value=> {
      this.messageService.showMessage({
        detail: 'Đổi mật khẩu thành công.'
      });
      this.router.navigate(['/']);
    })
  }

  getUserInfo() {
    this.httpService.get('/api/v1/ping')
    .pipe(map(res => res.data))
    .subscribe((user) => {
      this.saveUser(user);
    })
  }

  updateUser(user: User) {
    const url = '/api/v1/users/update'
    return this.httpService.put(url, { data: user });
  }
}
