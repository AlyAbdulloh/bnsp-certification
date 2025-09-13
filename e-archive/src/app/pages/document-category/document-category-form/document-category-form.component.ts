import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

// service
import { restApiService } from "src/app/core/services/rest-api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../document-category/toast-service";

@Component({
  selector: "app-document-category-form",
  templateUrl: "./document-category-form.component.html",
  styleUrls: ["./document-category-form.component.scss"],
})
export class DocumentCategoryFormComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  //mode
  mode: "add" | "edit" = "add";
  isSubmitted = false;

  documentCategoryForm!: UntypedFormGroup;
  paramsSubscription!: Subscription;
  id!: number;
  actionType: string = "Simpan";
  formTitle: string = "Tambah Data";

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restApiService: restApiService,
    private spinnerService: NgxSpinnerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.documentCategoryForm = this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
    });

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.mode = "edit";
        this.actionType = "Edit";
        this.formTitle = "Edit Data";
        this.id = params["id"];
        this.breadCrumbItems = [
          { label: "Kategori Surat" },
          { label: "Edit", active: true },
        ];
        this.getData(this.id);
      } else {
        this.breadCrumbItems = [
          { label: "Kategori Surat" },
          { label: "Tambah", active: true },
        ];
      }
    });
  }

  async onSubmit() {
    try {
      //cek form valid or not
      if (this.documentCategoryForm.invalid) {
        this.isSubmitted = true;
        return;
      }

      this.spinnerService.show();

      let body = {
        name: this.form["name"]?.value,
        description: this.form["description"]?.value,
      };

      if (this.mode === "add") {
        await firstValueFrom(this.restApiService.addDocumentCategory(body));
        this.documentCategoryForm.reset();
        this.isSubmitted = false;
      } else {
        await firstValueFrom(
          this.restApiService.editDocumentCategory(this.id, body)
        );
      }

      localStorage.setItem("save-success", "true");
      this.router.navigateByUrl("/document-category");
    } catch (error) {
      console.log(error);
    } finally {
      this.spinnerService.hide();
    }
  }

  get form() {
    return this.documentCategoryForm.controls;
  }

  async getData(id: number) {
    try {
      this.spinnerService.show();
      let { data } = await firstValueFrom(
        this.restApiService.getDocumentCategoryById(id)
      );
      this.documentCategoryForm.patchValue({
        name: data.name,
        description: data.description,
      });
      this.spinnerService.hide();
    } catch (error) {
      console.error("Error fetching document category:", error);
    }
  }

  back() {
    this.router.navigateByUrl("/document-category");
  }
}
