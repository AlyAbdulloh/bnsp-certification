import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Component Pages
import { DocumentComponent } from "./document/document.component";
import { ShowDocumentComponent } from "./show-document/show-document.component";
import { DocumentFormComponent } from "./document-form/document-form.component";

const routes: Routes = [
  {
    path: "",
    component: DocumentComponent,
  },
  {
    path: "show-document/:id",
    component: ShowDocumentComponent,
  },
  {
    path: "add-document",
    component: DocumentFormComponent,
  },
  {
    path: "archive-document/:id",
    component: DocumentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule {}
