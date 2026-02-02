import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../../@services/authentication.service';
import { ROLE_ADMIN } from '../constants/constant';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authService.currentUser;

  if (currentUser) {
    const hasRole = currentUser.roles?.some(role => role.name === ROLE_ADMIN);
    // Support both role check and admin flag
    if (hasRole || currentUser.admin || currentUser.is_admin) {
      return true;
    }
    // Logged in but not admin
    return router.createUrlTree(['/']);
  }

  // Not logged in or user info not loaded
  const token = authService.getToken();
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // If token exists but user info not loaded, allow temporarily.
  // The AdminComponent or API calls will handle final validation.
  return true;
};
