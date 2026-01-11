import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ImportModule } from '../../@themes/import.theme';
import { AuthenticationService } from '../../@services/authentication.service';
import { ChatService } from '../../@services/chat.service';

interface Message {
  text: string;
  html?: SafeHtml;
  isUser: boolean;
  time: Date;
}

@Component({
  selector: 'app-chat-popup',
  standalone: true,
  imports: [CommonModule, ImportModule],
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatPopupComponent implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly chatService = inject(ChatService);
  private readonly sanitizer = inject(DomSanitizer);

  isOpen = false;
  messages: Message[] = [];
  question = '';
  isLoading = false;

  ngOnInit(): void {
    // Initial welcome message
    this.messages.push({
      text: 'Xin chào! Tôi có thể giúp gì cho bạn về giày dép hôm nay?',
      html: this.formatMessage('Xin chào! Tôi có thể giúp gì cho bạn về giày dép hôm nay?'),
      isUser: false,
      time: new Date()
    });
  }

  formatMessage(text: string): SafeHtml {
    // Escape HTML to prevent injection (basic)
    let safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Replace **bold** with <b>bold</b>
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    // Replace * list items with bullets and newlines
    // This handles "* Item" -> "<br>• Item"
    safeText = safeText.replace(/\n/g, '<br>');
    safeText = safeText.replace(/(\s|^)\* /g, '<br>• ');

    // Replace Markdown images ![alt](url) with <img> tags
    safeText = safeText.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="chat-image" />');

    return this.sanitizer.bypassSecurityTrustHtml(safeText);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.question.trim()) return;

    const userQuestion = this.question;
    this.question = '';
    
    // Add user message
    this.messages.push({
      text: userQuestion,
      html: this.formatMessage(userQuestion),
      isUser: true,
      time: new Date()
    });

    this.isLoading = true;

    // Get session ID (username or default)
    let sessionId = 'default';
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.username) {
      sessionId = currentUser.username;
    }

    this.chatService.askQuestion(userQuestion, sessionId).subscribe({
      next: (response: any) => {
        // Assuming response is strictly formatted as per user requirement or standard
        // Adjust if response structure is different. 
        // Typically { response: "answer" } or similar.
        // User request didn't specify output format, I'll assume usage of the `text` or `answer` field
        // or just JSON stringify it if unknown.
        
        // Let's assume the LLM returns a text field "answer" or similar.
        // If it's the exact structure of the curl:
        // curl http://127.0.0.1:8000/ask...
        // I'll check what the user provided. The user provided the INPUT format.
        // I will dump the whole response if I can't find a text field, but let's assume 'answer' or 'response'.
        // For now, let's use a safe fallback.
        
        const botReply = response.answer || response.response || response.message || JSON.stringify(response);

        this.messages.push({
          text: botReply,
          html: this.formatMessage(botReply),
          isUser: false,
          time: new Date()
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.messages.push({
          text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.',
          html: this.formatMessage('Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.'),
          isUser: false,
          time: new Date()
        });
        this.isLoading = false;
      }
    });
  }
}
