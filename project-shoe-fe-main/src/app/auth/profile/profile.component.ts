import { Component, OnInit, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../@core/base/base.component";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { User } from "../../@core/models/auth.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    ImportModule,
    BaseInputComponent
  ]
})
export class ProfileComponent extends BaseComponent implements OnInit {
  isEdit = signal(false);
  form!: FormGroup<{
    first_name: FormControl<string | null>;
    last_name: FormControl<string | null>;
    phone_number: FormControl<string | null>;
    email: FormControl<string | null>;
    address: FormControl<string | null>;
  }>;
  user = signal<User | undefined>(undefined)

  ngOnInit(): void {
    this.initForm();
    this.rxSubscribe(this.authenticationService.getCurrentUserObservable(), (user) => {
      this.form.patchValue(user || {});
      this.user.set(user);
    })
  }

  initForm() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    })
    if (!this.isEdit()) {
      this.form.disable();
    }
  }

  editProfile() {
    this.isEdit.set(true);
    this.form.enable();
  }

  onSave() {
    const data = Object.assign(this.user() || {}, this.form.getRawValue());
    this.rxSubscribe(this.authenticationService.updateUser(data), (res) => {
      this.authenticationService.getUserInfo();
      this.goHome();
    })
  }

  goHome() {
    const role = this.user()?.roles;
    if (role && role[0].name === 'ADMIN') {
      this.router.navigate(['/admin'])
    }
    this.router.navigate(['/'])
  }
}
