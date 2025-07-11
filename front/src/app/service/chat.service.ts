import { Injectable } from '@angular/core';
import { ChatMessage } from '../interface/chatMessage';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private stompClient: CompatClient | null = null;
  public isConnected = false; // état de connexion

  // Établit une connexion WebSocket et écoute les messages reçus
  connect(onMessageReceived: (msg: ChatMessage) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      // Crée une connexion STOMP avec un WebSocket SockJS
      this.stompClient = Stomp.over(() => new SockJS('http://localhost:8080/chat'));

      // Connexion au serveur STOMP
      this.stompClient.connect({}, () => {
        this.isConnected = true;
        console.log('WebSocket connecté');
        // Abonnement au topic pour recevoir les messages
        this.stompClient?.subscribe('/topic/messages', (message: IMessage) => {
          const body: ChatMessage = JSON.parse(message.body);
          onMessageReceived(body);
        });
        resolve();
      }, (error: any) => {
        console.error('Erreur WebSocket :', error);
      });
    });
  }
  // Envoie un message via le serveur STOMP
  sendMessage(sender: string, content: string): void {
    if (this.stompClient && this.isConnected) {
      const payload: ChatMessage = { sender, content, timestamp: new Date(), };
      this.stompClient.send('/app/sendMessage', {}, JSON.stringify(payload));
    } else {
      console.warn('STOMP non connecté, message non envoyé');
    }
  }
}

