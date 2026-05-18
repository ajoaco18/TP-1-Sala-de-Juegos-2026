import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  public email: string = '';
  public pass: string = '';
  public nombre: string = '';
  public apellido: string = '';
  public edad!: number;
  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegistro(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.registro(this.email, this.pass, this.nombre, this.apellido, this.edad);
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        this.errorMessage = 'El usuario ya se encuentra registrado.';
      } else {
        this.errorMessage = error.message || 'Ocurrió un error durante el registro.';
      }
    }
  }
}