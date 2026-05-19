import { Component, OnInit, inject } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  private githubService = inject(GithubService);
  public datosGithub = this.githubService.userSignal;

  ngOnInit() {
    this.githubService.obtenerDatosGithub('ajoaco18');
  }
}