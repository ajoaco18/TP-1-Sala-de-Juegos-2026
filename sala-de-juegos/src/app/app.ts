import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private authService = inject(AuthService);
  
  public usuarioLogueado = this.authService.usuarioActual;
}