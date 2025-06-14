import { Component, inject, OnInit, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { User } from "../../@core/models/auth.model";
import { UserManagementService } from "../../@services/user-management.service";
import { BaseComponent } from "../../@core/base/base.component";
import { BasePage } from "../../@core/models/bill.model";
import { TablePageEvent } from "primeng/table";
import { BasePageResponse } from "../../@core/models/product.model";

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  imports: [
    ImportModule
  ]
})
export class UserManagementComponent extends BaseComponent implements OnInit {
  private readonly userManagementService = inject(UserManagementService);
  users = signal<User[]>([]);
  first = signal(0);
  rows = signal(10);
  rowsPerPageOptions = [10, 15, 20, 30];
  totalRecords = signal(0);
  params: BasePage = {
    page: this.first() + 1,
    size: this.rows()
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.userManagementService.getUsers(this.params), (result: BasePageResponse<User>) => {
      this.users.set(result.data || []);
      this.totalRecords.set(result.total || 0);
    })
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    this.params.page = Math.floor(this.first() / this.rows()) + 1
    this.params.size = this.rows();
    this.initData();
  }

  goAddUser() {
    this.router.navigate(['/admin/user-management/update-user']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/user-management/update-user'], { queryParams: { id }});
  }

  deActiveUser(id: number) {
    this.rxSubscribe(this.userManagementService.deActiveUser(id), (res) => {
      this.messageService.showMessage({
        detail: 'Chuyển trạng thái thành công.'
      });
      this.initData();
    })
  }

  activeUser(id: number) {
    this.rxSubscribe(this.userManagementService.activeUser(id), (res) => {
      this.messageService.showMessage({
        detail: 'Chuyển trạng thái thành công.'
      });
      this.initData();
    })
  }
}
