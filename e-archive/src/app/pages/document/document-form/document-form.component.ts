import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";

// service
import { restApiService } from "src/app/core/services/rest-api.service";

//model
import { DocumentCategories } from "./model";
import { ToastService } from "../document/toast-service";

@Component({
  selector: "app-document-form",
  templateUrl: "./document-form.component.html",
  styleUrls: ["./document-form.component.scss"],
})
export class DocumentFormComponent implements OnInit {
  allowedMimeType = ["application/pdf"];
  endpoint: string = environment.apiUrl + "file/uploads";

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  //mode
  mode: "add" | "edit" = "add";

  documentForm!: UntypedFormGroup;
  isSubmitted = false;
  paramsSubscription!: Subscription;

  actionType: string = "Unggah";
  formTitle: string = "Unggah Dokumen";
  id!: number;

  existingFileUrl: string | null = null; // URL of the existing file for edit mode

  documentCategories!: DocumentCategories[];
  fileToUpload: File | null = null;
  constructor(
    private restApiService: restApiService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Arsip Surat", url: "/document" },
      { label: this.actionType, active: true },
    ];

    this.documentForm = this.fb.group({
      document_number: ["", [Validators.required]],
      title: ["", [Validators.required]],
      doc_category_id: ["", [Validators.required]],
    });

    this.getDocumentCategories();

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.mode = "edit";
        this.actionType = "Edit";
        this.formTitle = "Edit Document";
        this.id = params["id"];
        this.getData(this.id);
      }
    });
  }

  get form() {
    return this.documentForm.controls;
  }

  async getData(id: number) {
    try {
      let { data } = await firstValueFrom(
        this.restApiService.getDocumentById(id)
      );
      this.documentForm.patchValue({
        document_number: data.document_number,
        title: data.title,
        doc_category_id: data.doc_category_id,
      });
      this.existingFileUrl = data.file_path
        ? this.endpoint + data.file_path
        : null;
    } catch (error: any) {
      this.toastService.show(error.message, {
        classname: "bg-danger text-center text-white",
        delay: 5000,
      });
      console.error("Error fetching document data:", error);
    }
  }

  async getDocumentCategories() {
    try {
      let { data } = await firstValueFrom(
        this.restApiService.getDocumentCategories()
      );

      const { rows } = data;
      this.documentCategories = rows;
    } catch (error: any) {
      this.toastService.show(error.message, {
        classname: "bg-danger text-center text-white",
        delay: 5000,
      });
      console.error("Error fetching document categories:", error);
    }
  }

  async onSubmit() {
    try {
      if (this.documentForm.invalid) {
        this.isSubmitted = true;
        return;
      }

      const formData = new FormData();
      formData.append("title", this.documentForm.get("title")?.value);
      formData.append(
        "doc_category_id",
        this.documentForm.get("doc_category_id")?.value
      );
      formData.append(
        "document_number",
        this.documentForm.get("document_number")?.value
      );

      if (this.fileToUpload) {
        formData.append("document", this.fileToUpload, this.fileToUpload.name);
      }

      if (this.mode === "add") {
        await firstValueFrom(this.restApiService.addDocumentData(formData));
        this.documentForm.reset();
        this.isSubmitted = false;
        this.fileToUpload = null;
      } else if (this.mode === "edit") {
        await firstValueFrom(
          this.restApiService.editDocumentData(this.id, formData)
        );
      }

      localStorage.setItem("save-success", "true");
      this.router.navigateByUrl("/document");
    } catch (error: any) {
      this.toastService.show(error.message, {
        classname: "bg-danger text-center text-white",
        delay: 5000,
      });
    }
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file && this.allowedMimeType.includes(file.type)) {
      this.fileToUpload = file;
      this.existingFileUrl = null;
    } else {
      this.fileToUpload = null;
      // this.documentForm.get("file_path")?.setErrors({ invalid: true });
    }
  }

  back() {
    this.router.navigateByUrl("/document");
  }
}
