import { Routes, CanActivateFn } from '@angular/router'; 
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { QuienSoy } from './components/quien-soy/quien-soy'; 
import { AhorcadoComponent } from './components/ahorcado/ahorcado';
import { MayorMenorComponent } from './components/mayor-menor/mayor-menor';
import { ChatComponent } from './components/chat/chat';
import { PreguntadosComponent } from './components/preguntados/preguntados';
import { JuegosReflejosComponent } from './components/juegos-reflejos/juegos-reflejos';
import { ResultadosComponent } from './components/resultados/resultados';

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.usuarioActual()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoy },
  { path: 'resultados', component: ResultadosComponent },
  
  { path: 'ahorcado', component: AhorcadoComponent, canActivate: [authGuard] },
  { path: 'mayor-menor', component: MayorMenorComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'preguntados', component: PreguntadosComponent, canActivate: [authGuard] },
  { path: 'juegos', component: JuegosReflejosComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];