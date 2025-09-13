import { Component, OnInit } from "@angular/core";
import { firstValueFrom, Subscription } from "rxjs";
import { Document } from "./model";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import * as moment from "moment";

//service
import { restApiService } from "src/app/core/services/rest-api.service";
import { NgxExtendedPdfViewerService } from "ngx-extended-pdf-viewer";

@Component({
  selector: "app-show-document",
  templateUrl: "./show-document.component.html",
  styleUrls: ["./show-document.component.scss"],
})
export class ShowDocumentComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  document!: Document;
  paramsSubscription!: Subscription;
  public pdfSrc: string = environment.apiUrl + "file/uploads";
  id!: number;

  constructor(
    private restApiService: restApiService,
    private route: ActivatedRoute,
    private router: Router,
    private pdfService: NgxExtendedPdfViewerService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Arsip Surat", url: "/document" },
      { label: "Lihat", active: true },
    ];

    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.getData(params["id"]);
    });
  }

  async getData(id: number) {
    try {
      let { data } = await firstValueFrom(
        this.restApiService.getDocumentById(id)
      );
      this.document = data;
      this.document.created_at = moment(this.document.created_at).format(
        "YYYY-MM-DD HH:mm"
      );
    } catch (error) {}
  }

  editDocument() {
    this.router.navigateByUrl(`/document/archive-document/${this.id}`);
  }

  //
  goBack() {
    this.router.navigate(["/document"]);
  }

  async downloadDocument() {
    const editedPdfData = await this.pdfService?.getCurrentDocumentAsBlob();

    // Create a Blob URL for the edited PDF data
    const blob = new Blob([editedPdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;

    // random filename
    const randomFileName = `${this.document.title}-${Date.now()}.pdf`;
    link.download = randomFileName;

    // Append the link to the document, trigger the download, and then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(url);
  }
}
