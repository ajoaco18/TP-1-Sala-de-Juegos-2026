import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MensajeChat {
  id?: number;
  usuario_id: string;
  email: string;
  mensaje: string;
  fecha: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  public usuarioActual = this.authService.usuarioActual;
  public listaMensajes: MensajeChat[] = [];
  public nuevoMensaje: string = '';
  
  private supabaseClient = this.authService.getClient();
  private supabaseChannel: any;

  ngOnInit(): void {
    this.conectarRealtimeChat();
  }

  ngOnDestroy(): void {
    if (this.supabaseChannel && this.supabaseClient) {
      this.supabaseClient.removeChannel(this.supabaseChannel);
    }
  }

  conectarRealtimeChat(): void {
    this.supabaseChannel = this.supabaseClient
      .channel('sala-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload: any) => {
          const mensajeEntrante: MensajeChat = payload.new;
          this.listaMensajes.push(mensajeEntrante);
          this.hacerScrollAlFinal();
          this.cdr.detectChanges();
        }
      )
      .subscribe();
  }

  async enviarMensaje(): Promise<void> {
    if (!this.nuevoMensaje.trim()) return;
    
    const user = this.usuarioActual();
    if (!user) return;

    const mensajeAEnviar = {
      usuario_id: user.id,
      email: user.email,
      mensaje: this.nuevoMensaje.trim(),
      fecha: new Date().toISOString()
    };

    this.nuevoMensaje = ''; 

    try {
      const { error } = await this.supabaseClient.from('chats').insert([mensajeAEnviar]);
      if (error) throw error;
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
    }
  }

  volverAlHome(): void {
    if (this.supabaseChannel && this.supabaseClient) {
      this.supabaseClient.removeChannel(this.supabaseChannel);
    }
    this.router.navigate(['/home']);
  }

  hacerScrollAlFinal(): void {
    setTimeout(() => {
      const contenedor = document.getElementById('chat-mensajes-container');
      if (contenedor) {
        contenedor.scrollTop = contenedor.scrollHeight;
      }
    }, 50);
  }
}