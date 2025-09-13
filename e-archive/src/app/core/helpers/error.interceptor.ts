import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorObj = {
          status: 500,
          message: "",
        };

        errorObj.message = "An unkown error occured";

        if (err.error instanceof ErrorEvent) {
          errorObj.message = `Error: ${err.error.message}`;
        } else {
          // server error
          switch (err.status) {
            case 401:
              // this.authenticationService.logout();
              errorObj.status = 401;
              errorObj.message =
                "Unauthorized - You do not have permission to access this resource. Please sign in again.";
              this.authenticationService.logout();
              // location.reload();
              break;
            case 403:
              errorObj.status = 403;
              errorObj.message =
                "Forbidden - You do not have permission to access this resource.";
              this.authenticationService.logout();
              this.router.navigate(["/"]);
              // this.router.navigate(['/pages/error'], { queryParams: { q: '403' } });
              break;
            case 404:
              errorObj.status = 404;
              errorObj.message = "Invalid credentials!";
              break;
            default:
              errorObj.message = "Internal server error.";
              break;
          }
        }
        return throwError(errorObj);
      })
    );
  }
}
