import { Component, OnInit } from "@angular/core";
import { firstValueFrom, Subject } from "rxjs";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

//service
import { restApiService } from "src/app/core/services/rest-api.service";
import { ToastService } from "./toast-service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";

//model
import { Document } from "./model";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.scss"],
})
export class DocumentComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  searchSubject = new Subject<string>();
  public pdfSrc: string = environment.apiUrl + "file/uploads";

  //data
  documents!: Document[];
  documentForm!: UntypedFormGroup;
  isSubmitted = false;
  id: number | undefined;

  searchTerm: string = "";

  //pagination
  currentPage: number = 1;
  totalData: number = 0;
  pageSize: number = 7;

  constructor(
    private restApiService: restApiService,
    private toastService: ToastService,
    private router: Router,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Surat", url: "/document" }];

    if (localStorage.getItem("toast")) {
      this.toastService.show("Logged in Successfull.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("toast");
    } else if (localStorage.getItem("save-success")) {
      this.toastService.show("Document berhasil disimpan.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("save-success");
    } else if (localStorage.getItem("delete-success")) {
      this.toastService.show("Document berhasil dihapus.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("delete-success");
    }

    // fetch data
    this.loadDocuments();
    this.initSearch();
  }

  async loadDocuments() {
    try {
      // params
      let params = {
        page: this.currentPage,
        pageSizes: this.pageSize,
        search: this.searchTerm,
      };

      this.spinnerService.show();

      let { data } = await firstValueFrom(
        this.restApiService.getDocumentData(params)
      );

      const { count, rows } = data;

      rows.map((item: Document) => {
        item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm");
      });

      this.documents = rows;
      this.totalData = count;
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      this.spinnerService.hide();
    }
  }

  viewDocument(id: number) {
    this.router.navigateByUrl(`/document/show-document/${id}`);
  }

  archiveDocument(id: number) {
    this.router.navigateByUrl(`/document/archive-document/${id}`);
  }

  //redirect to add document page
  addDocument() {
    this.router.navigateByUrl("/document/add-document");
  }

  openModal(content: any, id?: number) {
    this.id = id;
    this.modalService.open(content, { centered: true });
  }

  async deleteData() {
    try {
      this.spinnerService.show();
      await firstValueFrom(this.restApiService.deleteDocument(this.id));
      this.toastService.show("Document berhasil dihapus.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      this.loadDocuments();
    } catch (error) {
      this.toastService.show("Document gagal dihapus.", {
        classname: "bg-danger text-center text-white",
        delay: 5000,
      });
    } finally {
      this.spinnerService.hide();
    }
  }

  //filter search
  initSearch() {
    this.searchSubject
      .pipe(
        debounceTime(500),
        tap((term: string) => {
          this.searchTerm = term;
        }),
        switchMap(() => this.loadDocuments())
      )
      .subscribe();
  }

  async downloadFile(filePath: string) {
    try {
      const blob = await firstValueFrom(
        this.restApiService.downloadFile(filePath)
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  search(term: any) {
    this.searchSubject.next(term.target.value);
  }

  get endIndex(): number {
    const endIndex = this.currentPage * this.pageSize;
    return endIndex > this.totalData ? this.totalData : endIndex;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
}
