import { ChangeDetectionStrategy, Component, Input, computed, forwardRef, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-input-quantity',
  standalone: true,
  imports: [
    RippleModule,
    FormsModule,
    RippleModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './input-quantity.component.html',
  styleUrl: './input-quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputQuantityComponent {
  min = input<number>(0);
  max = input<number>(10000000000000);
  @Input() isDisabled = false;
  value = model<number>(1);
  change = output<number>();

  onInput(value: any) {
    this.value.set(Number(value));
    this.change.emit(this.value());
  }

  onDecease() {
    this.value.update((v) => {
      if (v <= this.min()) return this.min();
      return v - 1;
    });
    this.change.emit(this.value());
  }

  onIncrease() {
    this.value.update((v) => {
      if (v >= this.max()) return this.max();
      return v + 1;
    });
    this.change.emit(this.value());
  }
}
