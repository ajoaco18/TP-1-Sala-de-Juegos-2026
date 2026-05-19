import { Injectable, signal } from '@angular/core';
import { GithubUser } from '../interfaces/github-user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public userSignal = signal<GithubUser | null>(null);

  async obtenerDatosGithub(username: string): Promise<void> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      
      const usuarioFiltrado: GithubUser = {
        login: data.login,
        avatar_url: data.avatar_url,
        name: data.name || 'Joaquin Aguero',
        public_repos: data.public_repos,
        followers: data.followers
      };

      this.userSignal.set(usuarioFiltrado);
    } catch (error) {
      console.error('Error al traer datos de GitHub:', error);
    }
  }
}