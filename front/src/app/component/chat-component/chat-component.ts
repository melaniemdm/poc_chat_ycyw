import { Component } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../interface/chatMessage';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // nécessaire pour ngModel
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.scss']
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  content: string = '';
  sender: string = 'Moi';
  isReady = false; // Pour gérer l'état de connexion

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.connect((message) => {
      this.messages.push(message);
    }).then(() => {
       console.log("Connexion STOMP établie !");
      this.isReady = true;
    }).catch(err => {
      console.error("Connexion STOMP échouée", err);
    });
  }

  send(): void {
    if (!this.isReady) {
      console.warn("WebSocket non prêt, message non envoyé.");
      return;
    }

    if (this.sender.trim() && this.content.trim()) {
      this.chatService.sendMessage(this.sender, this.content);
      this.content = '';
    } else {
      console.warn("Nom d'utilisateur ou message vide.");
    }
  }
}
