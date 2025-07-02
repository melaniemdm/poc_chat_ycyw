import { Injectable } from '@angular/core';
import { ChatMessage } from '../interface/chatMessage';



@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private ws: WebSocket | null = null;
  private serverUrl = 'ws://localhost:8080/chat'; // ⚠️ à adapter à ton backend

  connect(onMessageReceived: (msg: ChatMessage) => void): void {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onmessage = (event) => {
      const body: ChatMessage = JSON.parse(event.data);
      onMessageReceived(body);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(sender: string, content: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload: ChatMessage = { sender, content };
      this.ws.send(JSON.stringify(payload));
    }
  }
}
