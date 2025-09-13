import { HTTP_INTERCEPTORS, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { TokenStorageService } from "../../core/services/token-storage.service";
import { Observable } from "rxjs";

@Injectable()
export class HttpInterceptors implements HttpInterceptor {
  private excludedUrls: string[] = [
    "https://genai.aio.co.id/api/v1/prediction/d26aa496-cf38-4c83-b2ca-471661c3a8c8", // Tambahkan endpoint yang dikecualikan
  ];

  constructor(
    private token: TokenStorageService,
    public tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isExcluded = this.excludedUrls.some((url) => req.url.includes(url));

    // // csrf token
    let xsrfToken = this.tokenExtractor.getToken();

    if (xsrfToken && !isExcluded) {
      req = req.clone({
        withCredentials: true,
        headers: req.headers.set("X-XSRF-TOKEN", xsrfToken),
      });
    } else {
      req = req.clone({
        withCredentials: true,
      });
    }

    // jwt token
    const currentUser = this.token.getToken();
    if (currentUser) {
      req = req.clone({
        setHeaders: {
          Authorization: `${currentUser}`,
        },
      });
    }

    return next.handle(req);
  }
}
