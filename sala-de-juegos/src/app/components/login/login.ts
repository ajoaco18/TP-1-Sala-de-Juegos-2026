import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  public email: string = '';
  public pass: string = '';
  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.pass);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión. Verifique los datos.';
    }
  }

  // Los accesos rápidos obligatorios para testing rápido
  cargarUsuarioRapido(num: number): void {
    if (num === 1) {
      this.email = 'admin@juegos.com';
      this.pass = 'admin1234';
    } else if (num === 2) {
      this.email = 'tester@sala.com';
      this.pass = 'test1234';
    } 
  }
}