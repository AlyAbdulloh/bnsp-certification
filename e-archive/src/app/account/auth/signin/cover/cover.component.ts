import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { CsrfService } from "src/app/core/services/csrf.service";
import { ToastService } from "../toast-service";
import { er } from "@fullcalendar/core/internal-common";

@Component({
  selector: "app-cover",
  templateUrl: "./cover.component.html",
  styleUrls: ["./cover.component.scss"],
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error: any;
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private csrfService: CsrfService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.router.navigate(["/"]);
    }

    this.loginForm = this.formBuilder.group({
      nim: [null, [Validators.required]],
      password: [null, Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  async onSubmit() {
    try {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }

      // get csrf token
      await firstValueFrom(this.csrfService.getCsrfToken());

      //auth login
      const data: any = await firstValueFrom(
        this.authService.login(this.f["nim"].value, this.f["password"].value)
      );

      // set data to local storage
      localStorage.setItem("toast", "true");
      localStorage.setItem("currentUser", JSON.stringify(data.data));
      localStorage.setItem("token", data.data.token);

      // redirect to return url
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error.status == 404) {
        errorMessage = "Invalid credentials!";
      }
      this.toastService.show(error.message, {
        classname: "bg-danger text-light",
      });
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
