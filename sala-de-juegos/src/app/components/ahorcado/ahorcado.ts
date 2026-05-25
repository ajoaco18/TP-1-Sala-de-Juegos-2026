import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.css']
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router); 

  private diccionario: string[] = [
    'MATE', 
    'MILANESA', 
    'FERNET', 
    'ALFAJOR', 
    'COLECTIVO', 
    'CHURROS', 
    'EMPANADA', 
    'ASADO', 
    'PORTALAMPARA', 
    'GATO'
  ];
  
  public palabraOculta: string = '';
  public palabraAdivinar: string[] = [];
  public letrasUsadas: string[] = [];
  public abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  
  public intentosFallidos: number = 0;
  public maxIntentos: number = 6;
  public juegoTerminado: boolean = false;
  public mensajeResultado: string = '';
  
  public palabrasCompletadas: number = 0;

  public tiempoSegundos: number = 0;
  private intervaloCronometro: any;

  ngOnInit(): void {
    this.iniciarPartidaCompleta();
  }

  ngOnDestroy(): void {
    this.detenerCronometro();
  }

  iniciarPartidaCompleta(): void {
    this.intentosFallidos = 0;
    this.palabrasCompletadas = 0;
    this.juegoTerminado = false;
    this.mensajeResultado = '';
    this.tiempoSegundos = 0;
    
    this.obtenerNuevaPalabra();
    this.iniciarCronometro();
  }

  obtenerNuevaPalabra(): void {
    this.letrasUsadas = [];
    const indiceRandom = Math.floor(Math.random() * this.diccionario.length);
    this.palabraOculta = this.diccionario[indiceRandom];
    this.palabraAdivinar = Array(this.palabraOculta.length).fill('_');
    console.log('--- PALABRA SECRETA: ---', this.palabraOculta);
  }

  iniciarCronometro(): void {
    this.detenerCronometro();
    this.intervaloCronometro = setInterval(() => {
      this.tiempoSegundos++;
      this.cdr.detectChanges();
    }, 1000);
  }

  detenerCronometro(): void {
    if (this.intervaloCronometro) {
      clearInterval(this.intervaloCronometro);
    }
  }

  volverAlHome(): void {
    this.detenerCronometro();
    this.router.navigate(['/home']);
  }

  intentarLetra(letra: string): void {
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) return;

    this.letrasUsadas.push(letra);

    if (this.palabraOculta.includes(letra)) {
      for (let i = 0; i < this.palabraOculta.length; i++) {
        if (this.palabraOculta[i] === letra) {
          this.palabraAdivinar[i] = letra;
        }
      }
      if (!this.palabraAdivinar.includes('_')) {
        this.palabrasCompletadas++;
        this.mensajeResultado = '¡Acertaste! Siguiente palabra... 🎉';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.mensajeResultado = '';
          this.obtenerNuevaPalabra();
          this.cdr.detectChanges();
        }, 1500);
      }
    } else {
      this.intentosFallidos++;
      if (this.intentosFallidos >= this.maxIntentos) {
        this.finalizarJuego();
      }
    }
  }

  async finalizarJuego(): Promise<void> {
    this.juegoTerminado = true;
    this.detenerCronometro();
    this.mensajeResultado = `❌ Fin del juego. Quedaste ahorcado. La palabra era: ${this.palabraOculta}`;

    const supabaseClient = this.authService.getClient();
    const usuario = this.authService.usuarioActual();
    if (!usuario || !supabaseClient) return;

    try {
      await supabaseClient
        .from('resultados_ahorcado')
        .insert([
          {
            usuario_id: usuario.id,
            email: usuario.email,
            palabra: this.palabraOculta,
            intentos_fallidos: this.intentosFallidos,
            tiempo_segundos: this.tiempoSegundos,
            gano: this.palabrasCompletadas > 0,
            fecha: new Date().toISOString()
          }
        ]);
      console.log('Record guardado exitosamente.');
    } catch (err) {
      console.error('Error al guardar datos del juego:', err);
    }
    this.cdr.detectChanges();
  }
}