import { Directive, HostBinding, HostListener, inject, output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MessagesService } from "../../@services/message.service";

@Directive({
  selector: '[dragAndDropFile]',
  standalone: true
})
export class DragAndDropFileDirective {
  private readonly messageService = inject(MessagesService);
  private readonly typeImage = ['png', 'jpg', 'jpeg', 'gif', 'svg']
  file = output<File>();
  @HostBinding("style.background") private background = "#eee";
  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';

    if (evt.dataTransfer) {
      if (evt.dataTransfer.files.length > 1) {
        this.messageService.showMessage({
          severity: 'warning',
          summary: 'Warn',
          detail: 'Vui lòng chọn 1 file'
        })
        return;
      }
      const file = evt.dataTransfer.files[0];
      if (file.size > 5000000) {
        this.messageService.showMessage({
          severity: 'warning',
          summary: 'Warn',
          detail: 'Vui lòng không chọn file có dung lượng lớn hơn 5MB'
        })
        return;
      }
      if (!this.typeImage.includes(file.type.split('/')[1])) {
        this.messageService.showMessage({
          severity: 'warning',
          summary: 'Warn',
          detail: `Sai định dạng ảnh. Chỉ được upload các file có đuôi ${this.typeImage.join(',')}`
        })
        return;
      }
      this.file.emit(file);
    }
  }
}
