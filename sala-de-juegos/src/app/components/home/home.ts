import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private authService = inject(AuthService);

  public usuarioLogueado = this.authService.usuarioActual;

  onLogout(): void {
    this.authService.logout();
  }
}