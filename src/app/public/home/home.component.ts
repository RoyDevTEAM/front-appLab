import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
  isMenuOpen = false; // Propiedad para controlar la visibilidad del menú

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado de isMenuOpen
  }
}
