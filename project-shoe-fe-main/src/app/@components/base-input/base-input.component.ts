import { AfterViewInit, Component, Injector, Input, OnInit, forwardRef, inject, input, model, output, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { ImportModule } from "../../@themes/import.theme";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss',
  standalone: true,
  imports: [
    ImportModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true
    }
  ]
})
export class BaseInputComponent implements ControlValueAccessor, OnInit {
  type = input<'text' | 'password'>('text');
  value = model<string>('');
  typeInput = input<'iconField' | 'text' | 'textarea' | 'floatLabel' | 'mask'>('text');
  label = input('');
  placeholder = input('');
  icon = input('pi-search');
  iconPosition = input<'left' | 'right'>('left');
  rows = input(3);
  autoResize = input(false);
  mask = input('');
  errors = input<ErrorMessageInput[]>([]);
  maxLength = input(500);
  ngControl!: NgControl;
  @Input() isDisabled = false;
  onBlur = output<any>();

  onTouch!: (event: any) => void;

  onChange!: (value?: any) => void;

  constructor(private inj: Injector) {
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  writeValue(obj: any): void {
    this.value.set(obj);
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

  onInput(value: string) {
    this.value.set(value);
    if (this.onChange) {
      this.onChange(value);
    }
  }

  onBlurInput(event: any) {
    this.onTouch(event);
    this.onBlur.emit(this.value());
  }
}

interface ErrorMessageInput {
  key: string;
  message: string;
}
