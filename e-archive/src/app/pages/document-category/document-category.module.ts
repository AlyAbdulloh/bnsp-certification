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
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { DocumentCategoryRoutingModule } from "./document-category-routing.module";
import { DocumentCategoryComponent } from "./document-category/document-category.component";
import { DocumentCategoryFormComponent } from "./document-category-form/document-category-form.component";
import { ToastsContainer } from "./document-category/toast-container.component";

// Component

@NgModule({
  declarations: [
    DocumentCategoryComponent,
    DocumentCategoryFormComponent,
    ToastsContainer,
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbPaginationModule,
    DocumentCategoryRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentCategoryModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
