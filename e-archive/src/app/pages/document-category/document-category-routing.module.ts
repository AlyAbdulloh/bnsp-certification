import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DocumentCategoryComponent } from "./document-category/document-category.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { DocumentCategoryFormComponent } from "./document-category-form/document-category-form.component";

// Component Pages

const routes: Routes = [
  {
    path: "",
    component: DocumentCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-document-category",
    component: DocumentCategoryFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-document-category/:id",
    component: DocumentCategoryFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentCategoryRoutingModule {}
