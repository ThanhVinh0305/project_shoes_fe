import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../@core/base/base.component';
import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { RegisterBody } from '../../@core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ImportModule,
    BaseInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {
  form!: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    first_name: FormControl<string | null>;
    last_name: FormControl<string | null>;
    phone_number: FormControl<string | null>;
    email: FormControl<string | null>;
    address: FormControl<string | null>;
  }>;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    })
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authenticationService.register(this.form.getRawValue() as RegisterBody);
  }
}
