import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  datosGithub: any = null;

  ngOnInit() {
    fetch('https://api.github.com/users/ajoaco18')
      .then(response => response.json())
      .then(data => {
        this.datosGithub = data;
      })
      .catch(error => console.error('Error al traer datos de GitHub:', error));
  }
}