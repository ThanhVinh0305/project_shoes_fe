import { Component } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
  imports: [
    ImportModule
  ]
})
export class FooterComponent {}
