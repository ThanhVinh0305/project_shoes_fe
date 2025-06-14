import { inject, Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpHeaders, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, finalize, map, Observable, retry, throwError } from "rxjs";
import { AuthenticationService } from "../../@services/authentication.service";
import { InterceptorHttpParams, RequestOptions } from "../../@services/http.service";
import { LoadingService } from "../../@services/loading.service";
import { MessagesService } from "../../@services/message.service";


export const GlobalHttpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authenticationService = inject(AuthenticationService);
  const loadingService = inject(LoadingService);
  const messageService = inject(MessagesService);
  const nextReq = (next: HttpHandlerFn, req: HttpRequest<unknown>, requestOptions: RequestOptions) => {
    return next(req).pipe(
      retry(0),
      map((event: HttpEvent<unknown>) => {
        return event;
      }),
      catchError((error: { error: { message?: string, success?: boolean }}) => {
        messageService.showMessage({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || '',
          life: 5000
        });
        return throwError(() => error);
      }),
      finalize(() => {
        if (!requestOptions.hideLoading) {
          loadingService.decrease();
        }
      })
    )
  }
  let requestOptions: RequestOptions;
  req.params instanceof InterceptorHttpParams ? (requestOptions = req.params.options) : (requestOptions = {});

  if (!requestOptions.hideLoading) {
    loadingService.increase();
  }

  let headers = req.headers;
  if ((req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put' ||
    req.method.toLowerCase() === 'get' || req.method.toLowerCase() === 'delete') && !(req.body instanceof FormData)) {
    headers = headers.set('Content-Type', 'application/json');
  }

  if (requestOptions.ignoreAuthToken) {
    const authReq = req.clone({
      headers
    });

    return nextReq(next, authReq, requestOptions);
  }

  const accessToken = authenticationService.getToken();
  if (!!accessToken) {
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const authReq = req.clone({
    headers
  })
  return nextReq(next, authReq, requestOptions);
}
