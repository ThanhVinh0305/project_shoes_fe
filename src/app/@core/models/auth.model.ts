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
  gender_id?: number; // 1 = Nữ, 2 = Nam, 3 = Unisex (từ database)
  gender_name?: string; // "Nữ", "Nam", "Unisex" - dùng trực tiếp để hiển thị
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
  genderId?: number; // FE gửi: 0 = Nữ, 1 = Nam (backend sẽ convert 0→1, 1→2)
}

export interface ChangePasswordBody {
  old_password?: string;
  new_assword?: string;
}
