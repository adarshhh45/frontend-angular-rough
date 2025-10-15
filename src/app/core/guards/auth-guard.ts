import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '../services/token-storage';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenStorage);
  const router = inject(Router);

  if (tokenService.getAccessToken()) {
    return true; // User is authenticated, allow access
  }

  // User is not authenticated, redirect to the login page
  router.navigate(['/auth/login']);
  return false;
};