import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

//Module
import { SharedModule } from "../../shared/shared.module";
import { WidgetModule } from "../../shared/widget/widget.module";
import { DocumentRoutingModule } from "./document-routing.module";
import { ToastsContainer } from "./document/toast-container.component";
import { DocumentComponent } from "./document/document.component";
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ShowDocumentComponent } from "./show-document/show-document.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { DocumentFormComponent } from "./document-form/document-form.component";

// Component

@NgModule({
  declarations: [
    ToastsContainer,
    DocumentComponent,
    ShowDocumentComponent,
    DocumentFormComponent,
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentRoutingModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgxExtendedPdfViewerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
