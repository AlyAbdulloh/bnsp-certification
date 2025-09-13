import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CsrfService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCsrfToken(): Observable<any> {
    return this.http.get(this.apiUrl + "csrf-token");
  }
}
