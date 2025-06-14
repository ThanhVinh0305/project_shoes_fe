import {inject, Injectable} from "@angular/core";
import { MessageService } from "primeng/api";
import {MessageModel} from "../@core/models/message.model";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly messageService = inject(MessageService);

  showMessage(message: MessageModel) {
    if (!message.severity) {
      message.severity = 'success';
    }
    if (!message.summary) {
      message.summary = 'Success';
    }
    message.key= 'notify';
    if (!message.life) {
      message.life = 3000;
    }
    this.messageService.add(message);
  }
}
