import { Injectable } from "@angular/core";
import { getFirebaseBackend } from "../../authUtils";
import { User } from "../models/auth.models";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { GlobalComponent } from "../../global-component";
import { environment } from "src/environments/environment";
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  user!: User;
  currentUserValue: any;
  apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser")!)
    );
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, first_name: string, password: string) {
    // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    // Register Api
    return this.http.post(
      AUTH_API + "signup",
      {
        email,
        first_name,
        password,
      },
      httpOptions
    );
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(nim: string, password: string) {
    return this.http.post(this.apiUrl + "auth/login", {
      nim,
      password,
    });
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    return getFirebaseBackend()!.getAuthenticatedUser();
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    // return getFirebaseBackend()!.logout();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.deleteCookie("XSRF-TOKEN");
    this.currentUserSubject.next(null!);
    this.router.navigate(["/auth/signin/cover"]);
  }

  // Utility method to delete a cookie by name
  deleteCookie(name: string): void {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    return getFirebaseBackend()!
      .forgetPassword(email)
      .then((response: any) => {
        const message = response.data;
        return message;
      });
  }

  userHasRole(roles: string[] = []): boolean {
    const user = this.tokenStorageService.getUser();
    const userRole = user?.role?.toLowerCase();

    roles.map((item: string) => item.toLowerCase());

    return user && roles.includes(userRole);
  }
}
