import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('../app/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('../app/home/main/main.component').then(m => m.MainComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('../app/home/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'product',
        loadComponent: () => import('../app/home/product/product.component').then(m => m.ProductComponent)
      },
      {
        path: 'shopping-cart',
        loadComponent: () => import('./home/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
      },
      {
        path: 'payment',
        loadComponent: () => import('./home/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'order-detail',
        loadComponent: () => import('./home/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'order-history',
        loadComponent: () => import('./home/order-history/order-history.component').then(m => m.OrderHistoryComponent)
      },
      {
        path: 'terms-and-service',
        loadComponent: () => import('./home/terms-and-service/terms-and-service.component').then(m => m.TermsAndServiceComponent)
      },
      {
        path: 'guide-shopping',
        loadComponent: () => import('./home/guide-shopping/guide-shopping.component').then(m => m.GuideShoppingComponent)
      },
      {
        path: 'shipping-policy',
        loadComponent: () => import('./home/shipping-policy/shipping-policy.component').then(m => m.ShippingPolicyComponent)
      },
      {
        path: 'refund-policy',
        loadComponent: () => import('./home/refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent)
      },
      {
        path: 'warranty-policy',
        loadComponent: () => import('./home/warranty-policy/warranty-policy.component').then(m => m.WarrantyPolicyComponent)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('../app/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [],
    children: [
      {
        path: '',
        loadComponent: () => import('../app/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'product-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/product-management/product-management.component').then(m => m.ProductManagement),
          },
          {
            path: 'update-product',
            loadComponent: () => import('../app/admin/update-product/update-product.component').then(m => m.UpdateProductComponent)
          },
        ]
      },
      {
        path: 'user-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
          },
          {
            path: 'update-user',
            loadComponent: () => import('../app/admin/update-user/update-user.component').then(m => m.UpdateUserComponent)
          },
        ]
      },
      {
        path: 'category-management',
        children: [
          {
            path: 'update-category',
            loadComponent: () => import('../app/admin/update-category/update-category.component').then(m => m.UpdateCategoryComponent)
          },
          {
            path: '',
            loadComponent: () => import('../app/admin/category-management/category-management.component').then(m => m.CategoryManagementComponent),
          }
        ]
      },
      {
        path: 'supplier-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/supplier-management/supplier-management.component').then(m => m.SupplierManagementComponent),
          },
          {
            path: 'update-supplier',
            loadComponent: () => import('../app/admin/update-supplier/update-supplier.component').then(m => m.UpdateSupplierComponent)
          },
        ]
      },
      {
        path: 'import-coupon-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/import-coupon/import-coupon-management.component').then(m => m.ImportCouponManagementComponent),
          },
          {
            path: 'update-import-coupon',
            loadComponent: () => import('../app/admin/update-import-coupon/update-import-coupon.component').then(m => m.UpdateImportCouponComponent)
          },
        ]
      },
      {
        path: 'promotion-program',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/promotion-program/promotion-program.component').then(m => m.PromotionProgramComponent),
          },
          {
            path: 'update-promotion-program',
            loadComponent: () => import('../app/admin/update-promotion-program/update-promotion-program').then(m => m.UpdatePromotionProgramComponent)
          },
        ]
      },
      {
        path: 'bill-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/bill-management/bill-management.component').then(m => m.BillManagementComponent),
          },
          {
            path: 'bill-detail',
            loadComponent: () => import('../app/admin/bill-detail/bill-detail.component').then(m => m.BillDetailComponent)
          },
        ]
      },
      {
        path: 'warehouse-management',
        children: [
          {
            path: '',
            loadComponent: () => import('../app/admin/ware-house/ware-house.component').then(m => m.WareHouseComponent),
          },
        ]
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('../app/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../app/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'change-password',
    loadComponent: () => import('../app/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('../app/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('../app/auth/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
