import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientXsrfModule,
} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "../environments/environment";
import { initFirebaseBackend } from "./authUtils";
import { FakeBackendInterceptor } from "./core/helpers/fake-backend";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";
import { HttpInterceptors } from "./core/helpers/http.interceptors";

// Language
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxSpinnerModule } from "ngx-spinner";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

if (environment.defaultauth === "firebase") {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "XSRF-TOKEN",
      headerName: "X-XSRF-TOKEN",
    }),
    NgxSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptors, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
