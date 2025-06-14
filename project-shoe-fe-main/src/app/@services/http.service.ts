import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";

export class InterceptorHttpParams extends HttpParams {
  constructor(public options: RequestOptions) {
    super({
      fromObject: options.params as {
        [param: string]: string | string[]
      }
    });
  }
}

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  data?: any;
  params?: { [param: string]: string | string[] | boolean | number | number[] | undefined };
  ignoreBaseUrl?: boolean;
  ignoreError?: boolean;
  hideLoading?: boolean;
  ignoreAuthToken?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  reportProgress?: boolean;
  observe?: 'response' | 'events' | 'body'
}

export interface HttpRequestOptions {
  headers: HttpHeaders | { [header: string]: string | string[]} | undefined;
  params: InterceptorHttpParams;
  observe: 'response' | 'events' | 'body';
  reportProgress: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly httpClient = inject(HttpClient);

  get(path: string, options?: RequestOptions) {
    const requestOptions = this.createRequestOptions(options);
    const baseUrl = this.getBaseUrl(options);
    return this.processRequest(this.httpClient.get(baseUrl + path, requestOptions as any), requestOptions);
  }

  post(path: string, options?: RequestOptions) {
    const requestOptions = this.createRequestOptions(options);
    const baseUrl = this.getBaseUrl(options);
    return this.processRequest(this.httpClient.post(baseUrl + path,options && options.data ? options.data : null ,requestOptions as any), requestOptions);
  }

  put(path: string, options?: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const baseUrl = this.getBaseUrl(options);
    return this.processRequest(this.httpClient.put(baseUrl + path, options && options.data ? options.data : null, requestOptions as any), requestOptions)
  }

  delete(path: string, options?: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const baseUrl = this.getBaseUrl(options);
    return this.processRequest(this.httpClient.delete(baseUrl + path, requestOptions as any), requestOptions)
  }

  private getBaseUrl(options?: RequestOptions) {
    return options && options.ignoreBaseUrl ? '' : environment.baseApiUrl;
  }

  private createRequestOptions(options?: RequestOptions): HttpRequestOptions {
    const mOptions: RequestOptions = {
      ...(options ? options : {})
    }

    const requestOptions: HttpRequestOptions = {
      headers: options ? options.headers : undefined,
      params: new InterceptorHttpParams(mOptions),
      observe: options?.observe ? options.observe : 'response',
      reportProgress: options?.reportProgress ? options.reportProgress : false,
      responseType: options?.responseType || 'json'
    }
    return requestOptions;
  }

  private processRequest(observable: Observable<any>, options: HttpRequestOptions) {
    return observable.pipe(
      map((response: any) => {
        if (response === undefined || response === null) {
          return response;
        }
        switch (options.observe) {
          case "body":
            return response;
          case "events":
            const event = response as HttpEvent<unknown>;
            if (event.type === HttpEventType.UploadProgress) {
              return event;
            } else if (event.type === HttpEventType.Response) {
              if (event.status === 200) {
                return event.body;
              } else {
                throwError(() => event);
              }
            }
            break;
          default: {
            //response
            if (response.status === 200) {
              return response.body;
            } else {
              throwError(() => response);
            }
          }
        }
      })
    )
  }
}
