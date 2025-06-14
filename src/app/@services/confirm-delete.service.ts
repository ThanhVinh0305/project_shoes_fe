import { Injectable, inject } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { ConfirmDeleteDialogComponent } from "../@components/confirm-dialog/confirm-delete.component";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDeleteDialogService {
  private readonly dialogService = inject(DialogService);

  showDelete() {
    const ref = this.dialogService.open(ConfirmDeleteDialogComponent, {
      width: '25rem',
      modal: true,
    })
    return ref.onClose;
  }
}
