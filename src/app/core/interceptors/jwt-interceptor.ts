import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../services/token-storage';
import { environment } from '../../../environments/environment'; 

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenStorage);
  const token = tokenService.getAccessToken();

  // Check if the request URL is for our own backend API
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  if (token && isApiUrl) {
    // Only add the token if it exists AND the request is to our API
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
  }

  return next(req);
};