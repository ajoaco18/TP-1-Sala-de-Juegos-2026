import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Carta {
  numero: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrls: ['./mayor-menor.css']
})
export class MayorMenorComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private palos: string[] = ['Oro', 'Copa', 'Espada', 'Basto'];
  public cartaActual!: Carta;
  public proximaCarta!: Carta;
  
  public aciertos: number = 0;
  public intentosTotales: number = 0;
  public vidas: number = 3; 
  public juegoTerminado: boolean = false;
  public mensajeResultado: string = '';
  public cargandoCarta: boolean = false;

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.aciertos = 0;
    this.intentosTotales = 0;
    this.vidas = 3;
    this.juegoTerminado = false;
    this.mensajeResultado = '';
    
    this.cartaActual = this.generarCartaAleatoria();
  }

  generarCartaAleatoria(): Carta {
    const numeroRandom = Math.floor(Math.random() * 12) + 1;
    const paloRandom = this.palos[Math.floor(Math.random() * this.palos.length)];
    return { numero: numeroRandom, palo: paloRandom };
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }

  async jugar(eleccion: 'mayor' | 'menor'): Promise<void> {
    if (this.juegoTerminado || this.cargandoCarta) return;

    this.cargandoCarta = true;
    this.proximaCarta = this.generarCartaAleatoria();
    this.intentosTotales++;

    if (this.proximaCarta.numero === this.cartaActual.numero) {
      this.mensajeResultado = `Empate! Salio otro ${this.proximaCarta.numero}. Seguis jugando.`;
      this.aciertos++; 
    } else if (
      (eleccion === 'mayor' && this.proximaCarta.numero > this.cartaActual.numero) ||
      (eleccion === 'menor' && this.proximaCarta.numero < this.cartaActual.numero)
    ) {
      this.aciertos++;
      this.mensajeResultado = 'Excelente! Acertaste. 🎉';
    } else {
      this.vidas--;
      this.mensajeResultado = 'Le pifiaste... ❌';
    }

    setTimeout(async () => {
      this.cartaActual = this.proximaCarta;
      this.mensajeResultado = '';
      
      if (this.vidas <= 0) {
        await this.finalizarPartida();
      }
      
      this.cargandoCarta = false;
      this.cdr.detectChanges();
    }, 1200);

    this.cdr.detectChanges();
  }

  async finalizarPartida(): Promise<void> {
    this.juegoTerminado = true;
    
    const supabaseClient = this.authService.getClient();
    const usuario = this.authService.usuarioActual();
    if (!usuario || !supabaseClient) return;

    try {
      await supabaseClient
        .from('resultados_mayor_menor')
        .insert([
          {
            usuario_id: usuario.id,
            email: usuario.email,
            cartas_acertadas: this.aciertos,
            intentos_totales: this.intentosTotales,
            fecha: new Date().toISOString()
          }
        ]);
      console.log('Resultado de Mayor o Menor guardado flama.');
    } catch (err) {
      console.error('Error al guardar en Supabase:', err);
    }
    this.cdr.detectChanges();
  }
}