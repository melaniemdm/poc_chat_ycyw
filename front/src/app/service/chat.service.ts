import { Injectable } from '@angular/core';

export interface ChatMessage {
  content: string;
  sender?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private ws: WebSocket | null = null;
  private serverUrl = 'ws://localhost:8080/chat'; // ⚠️ à adapter à ton backend

  connect(onMessageReceived: (msg: any) => void): void {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onmessage = (event) => {
      const body = JSON.parse(event.data);
      onMessageReceived(body);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(sender: string, content: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ sender, content });
      this.ws.send(payload);
    }
  }
}
