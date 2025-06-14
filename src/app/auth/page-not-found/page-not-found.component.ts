import { Component } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { BaseComponent } from "../../@core/base/base.component";
import { ROLE_ADMIN } from "../../@core/constants/constant";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  imports: [
    ImportModule
  ]
})
export class PageNotFoundComponent extends BaseComponent {
  goHome() {
    if (this.authenticationService.currentUser?.roles?.length) {
      if (this.authenticationService.currentUser?.roles[0].name === ROLE_ADMIN) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}