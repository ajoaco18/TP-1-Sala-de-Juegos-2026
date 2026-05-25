import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-juegos-reflejos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juegos-reflejos.html',
  styleUrls: ['./juegos-reflejos.css']
})
export class JuegosReflejosComponent implements OnDestroy {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  public modoSeleccionado: 'MENU' | 'CPS' | 'AIM' = 'MENU';
  public juegoIniciado: boolean = false;
  public juegoTerminado: boolean = false;
  
  public contadorCps: number = 0;
  public tiempoCps: number = 5; 
  public resultadoCpsResultante: number = 0;
  private intervaloCps: any;

  public circulosObjetivo: number = 20; 
  public circulosPegados: number = 0;
  public tiempoInicioAim: number = 0;
  public tiempoFinalAim: number = 0;
  public targetX: string = '50%';
  public targetY: string = '50%';
  private timerIntervalAim: any;
  public tiempoTranscurridoAim: number = 0;

  ngOnDestroy(): void {
    this.limpiarIntervalos();
  }

  cambiarModo(modo: 'MENU' | 'CPS' | 'AIM'): void {
    this.limpiarIntervalos();
    this.modoSeleccionado = modo;
    this.juegoIniciado = false;
    this.juegoTerminado = false;
    this.contadorCps = 0;
    this.circulosPegados = 0;
    this.tiempoCps = 5;
    this.tiempoTranscurridoAim = 0;
    this.cdr.detectChanges();
  }

  iniciarCps(): void {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.contadorCps = 0;
    this.tiempoCps = 5;

    this.intervaloCps = setInterval(() => {
      this.tiempoCps--;
      if (this.tiempoCps <= 0) {
        this.finalizarCps();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  registrarClicCps(): void {
    if (!this.juegoIniciado || this.juegoTerminado) return;
    this.contadorCps++;
  }

  async finalizarCps(): Promise<void> {
    this.limpiarIntervalos();
    this.juegoTerminado = true;
    this.resultadoCpsResultante = this.contadorCps / 5; 

    await this.guardarResultadoEnDB('CPS', this.resultadoCpsResultante);
  }

  iniciarAim(): void {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.circulosPegados = 0;
    this.tiempoTranscurridoAim = 0;
    this.moverCirculoAleatorio();

    this.tiempoInicioAim = performance.now();

    this.timerIntervalAim = setInterval(() => {
      this.tiempoTranscurridoAim = (performance.now() - this.tiempoInicioAim) / 1000;
      this.cdr.detectChanges();
    }, 50);
  }

  registrarPegadaAim(): void {
    if (!this.juegoIniciado || this.juegoTerminado) return;

    this.circulosPegados++;

    if (this.circulosPegados >= this.circulosObjetivo) {
      this.finalizarAim();
    } else {
      this.moverCirculoAleatorio();
    }
  }

  moverCirculoAleatorio(): void {
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 80) + 10;
    this.targetX = `${x}%`;
    this.targetY = `${y}%`;
    this.cdr.detectChanges();
  }

  async finalizarAim(): Promise<void> {
    this.limpiarIntervalos();
    this.juegoTerminado = true;
    this.tiempoFinalAim = (performance.now() - this.tiempoInicioAim) / 1000;

    await this.guardarResultadoEnDB('AIM', parseFloat(this.tiempoFinalAim.toFixed(3)));
  }

  volverAlHome(): void {
    this.limpiarIntervalos();
    this.router.navigate(['/home']);
  }

  async guardarResultadoEnDB(modalidad: 'CPS' | 'AIM', valorScore: number): Promise<void> {
    const usuario = this.authService.getClient();
    const userActual = this.authService.usuarioActual();
    if (!userActual || !usuario) return;

    try {
      await usuario.from('resultados_reflejos').insert([
        {
          usuario_id: userActual.id,
          email: userActual.email,
          modalidad: modalidad,
          puntaje: valorScore,
          fecha: new Date().toISOString()
        }
      ]);
      console.log(`Resultado ${modalidad} guardado con éxito.`);
    } catch (err) {
      console.error('Error al guardar métricas de reflejos:', err);
    }
    this.cdr.detectChanges();
  }

  private limpiarIntervalos(): void {
    if (this.intervaloCps) clearInterval(this.intervaloCps);
    if (this.timerIntervalAim) clearInterval(this.timerIntervalAim);
  }
}