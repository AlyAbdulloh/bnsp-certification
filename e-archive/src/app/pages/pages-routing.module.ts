import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { AuthGuard } from "../core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "document",
    pathMatch: "full",
  },
  {
    path: "document",
    loadChildren: () =>
      import("./document/document.module").then((m) => m.DocumentModule),
  },
  {
    path: "document-category",
    loadChildren: () =>
      import("./document-category/document-category.module").then(
        (m) => m.DocumentCategoryModule
      ),
  },
  {
    path: "about",
    component: AboutComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
