import { Component, OnInit } from "@angular/core";
import { firstValueFrom, Subject } from "rxjs";
import { Router } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";

//service
import { restApiService } from "src/app/core/services/rest-api.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";

//model
import { DocumentCategory } from "./model";
import { ToastService } from "./toast-service";

@Component({
  selector: "app-document-category",
  templateUrl: "./document-category.component.html",
  styleUrls: ["./document-category.component.scss"],
})
export class DocumentCategoryComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  searchSubject = new Subject<string>();

  //data
  documentCategories!: DocumentCategory[];
  id!: number;

  searchTerm: string = "";

  //pagination
  currentPage: number = 1;
  totalData: number = 0;
  pageSize: number = 7;
  constructor(
    private router: Router,
    private restApiService: restApiService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Kategori Surat", url: "/document-category" },
    ];

    if (localStorage.getItem("toast")) {
      this.toastService.show("Logged in Successfull.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("toast");
    } else if (localStorage.getItem("save-success")) {
      this.toastService.show("Data berhasil disimpan.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("save-success");
    } else if (localStorage.getItem("delete-success")) {
      this.toastService.show("Data berhasil dihapus.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      localStorage.removeItem("delete-success");
    }

    //fetch data
    this.loadData();
    this.initSearch();
  }

  async loadData() {
    try {
      // params
      this.spinnerService.show();
      let params = {
        page: this.currentPage,
        pageSizes: this.pageSize,
        search: this.searchTerm,
      };
      const { data } = await firstValueFrom(
        this.restApiService.getDocumentCategories(params)
      );

      const { count, rows } = data;
      this.documentCategories = rows;

      this.totalData = count;
    } catch (error) {
    } finally {
      this.spinnerService.hide();
    }
  }

  async deleteData() {
    try {
      this.spinnerService.show();
      await firstValueFrom(
        this.restApiService.deleteDocumentCategory(this.id || 0)
      );
      this.toastService.show("Data berhasil dihapus.", {
        classname: "bg-success text-center text-white",
        delay: 5000,
      });
      this.loadData();
    } catch (error) {
      this.toastService.show("Document gagal dihapus.", {
        classname: "bg-danger text-center text-white",
        delay: 5000,
      });
    }
  }

  //redirect to add document page
  addDocumentCategory() {
    this.router.navigateByUrl("/document-category/add-document-category");
  }

  //redirect to edit document page
  editDocumentCategory(id: number) {
    this.router.navigateByUrl(
      `/document-category/edit-document-category/${id}`
    );
  }

  //open delete data modal
  openModal(content: any, id: number = 0) {
    this.id = id;
    this.modalService.open(content, { centered: true });
  }

  //filter search
  initSearch() {
    this.searchSubject
      .pipe(
        debounceTime(500),
        tap((term: string) => {
          this.searchTerm = term;
        }),
        switchMap(() => this.loadData())
      )
      .subscribe();
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
