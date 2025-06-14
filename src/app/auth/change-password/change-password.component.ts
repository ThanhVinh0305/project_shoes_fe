import { Component, OnInit, model } from "@angular/core";
import { BaseComponent } from "../../@core/base/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { ImportModule } from "../../@themes/import.theme";
import { ChangePasswordBody } from "../../@core/models/auth.model";

@Component({
    selector: 'app-change-password',
    standalone: true,
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
    imports: [BaseInputComponent, ImportModule],
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  value = model('');
  form!: FormGroup<{
    old_password: FormControl<string | null>;
    new_password: FormControl<string | null>;
    confirm_password: FormControl<string | null>;
  }>;

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    })
  }

  checkPassword() {
    if (this.form.controls['new_password']?.value && this.form.controls['confirm_password']?.value) {
      if (this.form.controls['new_password']?.value !== this.form.controls['confirm_password']?.value) {
        this.form.controls['confirm_password']?.setErrors({ 'confirm_password': true })
      }
    }
  }

  submit() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    this.authenticationService.changePassword(this.form.getRawValue() as ChangePasswordBody);
  }
}
