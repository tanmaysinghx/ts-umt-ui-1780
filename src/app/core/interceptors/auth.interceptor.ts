import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { CommonService } from '../../features/services/common.service';

// Mutex to prevent multiple refresh calls
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const cookieService = inject(CookieService);
  const commonService = inject(CommonService);
  const router = inject(Router);

  // 1. Add Authorization header if token exists
  const token = localStorage.getItem('access-token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  // 2. Handle request and catch 401
  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('auth/login') && // Don't refresh on login failure
        !req.url.includes('auth/refresh-token') // Don't refresh on refresh failure
      ) {
        return handle401Error(authReq, next, cookieService, commonService, router);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  cookieService: CookieService,
  commonService: CommonService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = cookieService.get('refresh-token');

    if (refreshToken) {
      return commonService.generateJWTTokenBasedOnRefreshToken(refreshToken).pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          const newToken = res?.data?.downstreamResponse?.data?.accessToken;

          if (newToken) {
            localStorage.setItem('access-token', newToken);
            refreshTokenSubject.next(newToken);
            
            // Retry original request with new token
            return next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              })
            );
          } else {
            // Refresh failed (no token in response)
            handleLogout(router, cookieService);
            return throwError(() => new Error('Refresh failed'));
          }
        }),
        catchError((err) => {
          isRefreshing = false;
          handleLogout(router, cookieService);
          return throwError(() => err);
        })
      );
    } else {
      // No refresh token available
      isRefreshing = false;
      handleLogout(router, cookieService);
      return throwError(() => new Error('No refresh token'));
    }
  } else {
    // If already refreshing, wait for the new token
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        );
      })
    );
  }
}

function handleLogout(router: Router, cookieService: CookieService) {
  localStorage.clear();
  cookieService.deleteAll();
  router.navigate(['/auth/login']);
}
