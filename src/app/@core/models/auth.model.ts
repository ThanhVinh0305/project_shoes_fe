export interface User {
  id?: number;
  username?: string;
  password?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  roles?: Role[];
  active?: boolean;
  admin?: boolean;
  is_admin?: boolean;
}

export interface Role {
  id?: number;
  name?: string;
}

export interface LoginBody {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  access_token?: string;
  expires_in?: string;
  refresh_token?: string;
  user_info?: User;
}

export interface BaseRespone<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface RegisterBody {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
}

export interface ChangePasswordBody {
  old_password?: string;
  new_assword?: string;
}
