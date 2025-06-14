import { ChangeDetectionStrategy, Component, Input, computed, forwardRef, input, model, output } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-input-quantity',
  standalone: true,
  imports: [
    ImportModule,
    RippleModule
  ],
  templateUrl: './input-quantity.component.html',
  styleUrl: './input-quantity.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputQuantityComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputQuantityComponent implements ControlValueAccessor {
  min = input<number>(0);
  max = input<number>(10000000000000);
  @Input() isDisabled = false;
  value = model<number | undefined>(undefined);
  change = output<number | undefined>();

  onTouch!: (event: any) => void;

  onChange?: (value?: any) => void;

  writeValue(value: number | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(value: any) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  onDecease() {
    if (this.onChange) {
      this.value.update((value) => {
        if (value === 0) {
          return 0;
        }
        if (value) {
          return --value;
        }
        return value;
      });
      this.onChange(this.value());
      this.change.emit(this.value())
    }
  }

  onIncrease() {
    if (this.onChange) {
      this.value.update((value) => {
        if (value || value === 0) {
          return ++value;
        }
        return value;
      });
      this.onChange(this.value());
      this.change.emit(this.value())
    }
  }
}
