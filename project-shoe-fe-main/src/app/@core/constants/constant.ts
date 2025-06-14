import { Breadcrumb } from "../models/breadcrumb.model";


export const CONFIG_ADMIN_ROUTER: { [key: string]: string } = {
  'admin': '',
  'product-management': 'Quản lý sản phẩm',
}

export const ROLE_ADMIN = 'ADMIN';
export const ROLE_CUSTOMER = 'ROLE_USER';

export const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export const rowsPerPageOptions = [10, 15, 20, 30];

export const noImage = '../../../assets/images/no-image.jpg';

export const STATUS_BILL = [
  { value: 0, label: 'Chưa hoàn thành' },
  { value: 1, label: 'Hoàn thành' },
  { value: 2, label: 'Huỷ đơn hàng' },
]

export const ROLES = [
  {
    value: "ADMIN",
    name: "ADMIN"
  },
  {
    value: "ROLE_USER",
    name: "ROLE_USER"
  }
]

export const BREADCRUMBS: Breadcrumb[] = [
  {
    routerLink: 'admin',
    label: ''
  },
  {
    routerLink: 'supplier-management',
    label: 'Quản lý nhà cũng cấp'
  },
  {
    routerLink: 'update-supplier',
    label: 'Cập nhật nhà cũng cấp'
  },
  {
    routerLink: 'category-management',
    label: 'Quản lý danh mục'
  },
  {
    routerLink: 'update-category',
    label: 'Cập nhật danh mục'
  },
  {
    routerLink: 'product-management',
    label: 'Quản lý sản phẩm'
  },
  {
    routerLink: 'update-product',
    label: 'Cập nhật sản phẩm'
  },
  {
    routerLink: 'promotion-program',
    label: 'Quản lý chương trình khuyến mại'
  },
  {
    routerLink: 'update-promotion-program',
    label: 'Cập nhật chương trình khuyến mại'
  },
  {
    routerLink: 'import-coupon-management',
    label: 'Quản lý phiếu nhập'
  },
  {
    routerLink: 'update-import-coupon',
    label: 'Cập nhật phiếu nhập'
  },
  {
    routerLink: 'products',
    label: 'Danh sách sản phẩm'
  },
  {
    routerLink: 'promotion-product',
    label: 'Sản phẩm khuyến mại'
  },
  {
    routerLink: 'bill-management',
    label: 'Quản lý đơn hàng'
  },
  {
    routerLink: 'bill-detail',
    label: 'Chi tiết đơn hàng'
  },
  {
    routerLink: 'shopping-cart',
    label: 'Chi tiết đơn hàng'
  },
  {
    routerLink: 'warehouse-management',
    label: 'Quản lý kho'
  },
  {
    routerLink: 'user-management',
    label: 'Quản lý người dùng'
  },
  {
    routerLink: 'update-user',
    label: 'cập nhật người dùng'
  },
]
