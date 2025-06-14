import { Component, input } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  text = input<string>('');
  severity = input<'secondary' | 'success' >('secondary');
}

export type typeServerity = 'secondary';
