import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.css']
})
export class ResultadosComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  public rankingAhorcado: any[] = [];
  public rankingMayorMenor: any[] = [];
  public rankingPreguntados: any[] = [];
  public rankingReflejos: any[] = [];

  ngOnInit(): void {
    this.cargarTodosLosRankings();
  }

  async cargarTodosLosRankings(): Promise<void> {
    const supabaseClient = this.authService.getClient();
    if (!supabaseClient) return;

    try {
      const { data: ahorcado } = await supabaseClient
        .from('resultados_ahorcado')
        .select('*')
        .order('intentos_fallidos', { ascending: false })
        .limit(10);
      this.rankingAhorcado = ahorcado || [];

      const { data: mayorMenor } = await supabaseClient
        .from('resultados_mayor_menor')
        .select('*')
        .order('cartas_acertadas', { ascending: false })
        .limit(10);
      this.rankingMayorMenor = mayorMenor || [];

      const { data: preguntados } = await supabaseClient
        .from('resultados_preguntados')
        .select('*')
        .order('preguntas_correctas', { ascending: false })
        .limit(10);
      this.rankingPreguntados = preguntados || [];

      const { data: reflejos } = await supabaseClient
        .from('resultados_reflejos')
        .select('*')
        .order('puntaje', { ascending: false })
        .limit(15);
      this.rankingReflejos = reflejos || [];

    } catch (err) {
      console.error('Error al cargar las tablas de estadisticas:', err);
    } finally {
      this.cdr.detectChanges();
    }
  }
}