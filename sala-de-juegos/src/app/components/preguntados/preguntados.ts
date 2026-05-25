import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface PreguntaTrivia {
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  opcionesMezcladas: string[];
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class PreguntadosComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  public preguntas: PreguntaTrivia[] = [];
  public indiceActual: number = 0;
  public preguntaActual!: PreguntaTrivia;
  
  public aciertos: number = 0;
  public totalPreguntasPartida: number = 5; 
  public juegoTerminado: boolean = false;
  public respondido: boolean = false;
  public mensajeFeedback: string = '';
  public seleccionada: string = '';
  public cargando: boolean = true;
  public textoCargando: string = 'Conectando con la API internacional... 🌍';

  private preguntasLocalesDeRespaldo: PreguntaTrivia[] = [
    {
      category: 'Cultura General',
      question: 'Cual es la capital de la provincia de Buenos Aires?',
      correct_answer: 'La Plata',
      incorrect_answers: ['Mar del Plata', 'Rosario', 'Tandil'],
      opcionesMezcladas: []
    },
    {
      category: 'Deportes',
      question: 'En que año gano Argentina su tercera copa del mundo de futbol?',
      correct_answer: '2022',
      incorrect_answers: ['1978', '1986', '2014'],
      opcionesMezcladas: []
    },
    {
      category: 'Cultura General',
      question: 'Cual de las siguientes opciones es una comida tipica argentina?',
      correct_answer: 'Asado',
      incorrect_answers: ['Tacos', 'Sushi', 'Paella'],
      opcionesMezcladas: []
    },
    {
      category: 'Historia',
      question: 'Que se conmemora en Argentina el 25 de Mayo?',
      correct_answer: 'La Revolucion de Mayo',
      incorrect_answers: ['La Declaracion de la Independencia', 'El Dia de la Bandera', 'Fin de Año'],
      opcionesMezcladas: []
    },
    {
      category: 'Geografia',
      question: 'Cual es el pico mas alto de Argentina y de toda America?',
      correct_answer: 'El Aconcagua',
      incorrect_answers: ['El Volcan Lanin', 'El Cerro Chalten', 'El Monte Fitz Roy'],
      opcionesMezcladas: []
    }
  ];

  ngOnInit(): void {
    this.iniciarNuevaPartida();
  }

  async iniciarNuevaPartida(): Promise<void> {
    this.indiceActual = 0;
    this.aciertos = 0;
    this.juegoTerminado = false;
    this.respondido = false;
    this.mensajeFeedback = '';
    this.seleccionada = '';
    this.cargando = true;
    this.textoCargando = 'Conectando con la API internacional... 🌍';
    
    await this.obtenerPreguntasDeAPI();
  }

  async obtenerPreguntasDeAPI(): Promise<void> {
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=9&type=multiple');
      
      if (!res.ok) {
        throw new Error(`Error API HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        this.textoCargando = 'Traduciendo preguntas al español... ✍️';
        this.cdr.detectChanges();

        const preguntasProcesadas = [];

        for (const p of data.results) {
          const preguntaLimpiaEn = this.decodificarHTML(p.question);
          const correctaLimpiaEn = this.decodificarHTML(p.correct_answer);
          const incorrectasLimpiasEn = p.incorrect_answers.map((i: string) => this.decodificarHTML(i));

          const [preguntaEs, correctaEs] = await Promise.all([
            this.traducirTexto(preguntaLimpiaEn),
            this.traducirTexto(correctaLimpiaEn)
          ]);

          const incorrectasEs = [];
          for (const incEn of incorrectasLimpiasEn) {
            const incEs = await this.traducirTexto(incEn);
            incorrectasEs.push(incEs);
          }

          const opciones = [...incorrectasEs, correctaEs];
          opciones.sort(() => Math.random() - 0.5);
          
          preguntasProcesadas.push({
            category: p.category,
            question: preguntaEs,
            correct_answer: correctaEs,
            incorrect_answers: incorrectasEs,
            opcionesMezcladas: opciones
          });
        }

        this.preguntas = preguntasProcesadas;
      } else {
        this.cargarPreguntasRespaldo();
      }

    } catch (err) {
      console.warn('Cargando preguntas criollas locales en español... 👍');
      this.cargarPreguntasRespaldo();
    } finally {
      this.preguntaActual = this.preguntas[this.indiceActual];
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarPreguntasRespaldo(): void {
    this.preguntas = this.preguntasLocalesDeRespaldo.map(p => {
      const opciones = [...p.incorrect_answers, p.correct_answer];
      opciones.sort(() => Math.random() - 0.5);
      return {
        ...p,
        opcionesMezcladas: opciones
      };
    });
    this.preguntas.sort(() => Math.random() - 0.5);
  }

  async traducirTexto(texto: string): Promise<string> {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es`;
      const res = await fetch(url);
      if (!res.ok) return texto;
      
      const data = await res.json();
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      return texto;
    } catch (error) {
      return texto;
    }
  }

  decodificarHTML(texto: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = texto;
    return txt.value;
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }

  verificarRespuesta(opcion: string): void {
    if (this.respondido) return;

    this.respondido = true;
    this.seleccionada = opcion;

    if (opcion === this.preguntaActual.correct_answer) {
      this.aciertos++;
      this.mensajeFeedback = '¡Correcto! 🌟';
    } else {
      this.mensajeFeedback = `Incorrecto ❌ La respuesta era: ${this.preguntaActual.correct_answer}`;
    }
    this.cdr.detectChanges();
  }

  siguientePregunta(): void {
    this.respondido = false;
    this.mensajeFeedback = '';
    this.seleccionada = '';
    this.indiceActual++;

    if (this.indiceActual < this.totalPreguntasPartida) {
      this.preguntaActual = this.preguntas[this.indiceActual];
    } else {
      this.finalizarJuego();
    }
    this.cdr.detectChanges();
  }

  async finalizarJuego(): Promise<void> {
    this.juegoTerminado = true;

    const usuario = this.authService.getClient(); 
    const userActual = this.authService.usuarioActual();
    if (!userActual || !usuario) return;

    try {
      await usuario
        .from('resultados_preguntados')
        .insert([
          {
            usuario_id: userActual.id,
            email: userActual.email,
            preguntas_correctas: this.aciertos,
            preguntas_totales: this.totalPreguntasPartida,
            fecha: new Date().toISOString()
          }
        ]);
      console.log('Estadísticas de Preguntados guardadas en Supabase.');
    } catch (err) {
      console.error('Error al guardar en Supabase:', err);
    }
    this.cdr.detectChanges();
  }
}