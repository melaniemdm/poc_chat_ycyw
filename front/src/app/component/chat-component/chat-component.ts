import { Component } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // nécessaire pour ngModel
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.scss']
})
export class ChatComponent {
  messages: any[] = [];
  content: string = '';
  sender: string = 'Moi';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.connect((msg) => {
      this.messages.push(msg);
    });
  }

  send() {
    if (this.content.trim()) {
      this.chatService.sendMessage(this.sender, this.content);
      this.content = '';
    }
  }
}
