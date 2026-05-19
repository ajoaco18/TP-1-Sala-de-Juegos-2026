import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  public errorMessage: string = '';
  public cargando: boolean = false; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  async onLogin(email: string, pass: string): Promise<void> {
    this.errorMessage = '';

    if (!email.trim() || !pass.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      this.errorMessage = 'El formato del correo electronico no es valido.';
      return;
    }

    try {
      this.cargando = true; 
      this.cdr.detectChanges(); 

      await this.authService.login(email, pass);
      this.router.navigate(['/']); 
    } catch (error: any) {
      this.cargando = false; 
      console.log('Error en Login:', error);

      if (error.message === 'Invalid login credentials' || error?.status === 400) {
        this.errorMessage = 'Correo o contrasenia incorrectos. Intentalo de nuevo.';
      } else {
        this.errorMessage = error.message || 'Error al iniciar sesion. Verifique los datos.';
      }
      this.cdr.detectChanges(); 
    }
  }

  async loginRapido(email: string, pass: string, emailInput: HTMLInputElement, passInput: HTMLInputElement): Promise<void> {
    if (this.cargando) return;
    
    emailInput.value = email;
    passInput.value = pass;
    
    await this.onLogin(email, pass);
  }
}