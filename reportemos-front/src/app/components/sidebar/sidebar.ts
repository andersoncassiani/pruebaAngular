import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ReportesService } from '../../services/reportes-service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  auth = inject(AuthService);

  salir() {
    this.auth.cerrarSesion();
    this.reportesService.reportes.set([]); // Limpia la lista para el siguiente usuario
    this.router.navigate(['/login']);
  }
}