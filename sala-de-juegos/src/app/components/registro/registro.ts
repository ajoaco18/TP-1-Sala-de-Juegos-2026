import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  public errorMessage: string = '';
  public successMessage: string = ''; 
  public cargando: boolean = false;   

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  async onRegistro(email: string, pass: string, nombre: string, apellido: string, edadStr: string): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    const edad = parseInt(edadStr, 10);

    if (!email.trim() || !pass.trim() || !nombre.trim() || !apellido.trim() || !edadStr.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos del formulario.';
      return;
    }

    if (isNaN(edad) || edad <= 0 || edad > 120) {
      this.errorMessage = 'Por favor, ingresa una edad valida.';
      return;
    }

    if (pass.length < 6 || pass.length > 20) {
      this.errorMessage = 'La contrasenia debe tener entre 6 y 20 caracteres.';
      return;
    }


    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,30}(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,30})*$/;
    const regexApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,30}$/;

    if (!regexNombre.test(nombre.trim())) {
      this.errorMessage = 'El nombre solo debe contener letras (entre 2 y 30 caracteres) y no empezar/terminar con espacios.';
      return;
    }

    if (!regexApellido.test(apellido.trim()) || apellido.includes(' ')) {
      this.errorMessage = 'El apellido solo debe contener letras, sin espacios ni caracteres especiales (entre 2 y 30 caracteres).';
      return;
    }

    try {
      this.cargando = true; 
      this.cdr.detectChanges(); 

      await this.authService.registro(email, pass, nombre, apellido, edad);
      
      this.successMessage = '¡Cuenta creada con exito! Iniciando sesion...';
      this.cdr.detectChanges();

      setTimeout(() => {
        this.router.navigate(['/']); 
      }, 2000);

    } catch (error: any) {
      this.cargando = false; 
      console.log('Error detectado interno:', error);
      this.errorMessage = 'El correo electronico ya se encuentra registrado. Intenta con otro.';
      this.cdr.detectChanges(); 
    }
  }
}