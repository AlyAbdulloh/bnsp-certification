import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

// Component
import { SigninRoutingModule } from "./signin-routing.module";
import { BasicComponent } from "./basic/basic.component";
import { CoverComponent } from "./cover/cover.component";
import { ToastsContainer } from "./toast-container.component";

@NgModule({
  declarations: [BasicComponent, CoverComponent, ToastsContainer],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    SigninRoutingModule,
    NgbToastModule,
  ],
})
export class SigninModule {}
