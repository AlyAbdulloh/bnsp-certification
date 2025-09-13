import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

// Auth Services
import { AuthenticationService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem("currentUser")) {
      if (route.data && route.data["role"]) {
        const requireRole = route.data["role"];

        // check user has a required role
        if (!this.authenticationService.userHasRole(requireRole)) {
          this.router.navigate(["/pages/error"], { queryParams: { q: "403" } });
          return false;
        }
      }
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/auth/signin/cover"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
