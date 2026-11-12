import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService, ReporteAdmin } from '../../services/admin-service';
import { environment } from '../../../environments/environment';

@Component({
  imports: [DatePipe],
  selector: 'app-admin-reportes',
  styleUrl: './admin-reportes.css',
  templateUrl: './admin-reportes.html',
})
export class AdminReportes implements OnInit {
  adminService = inject(AdminService);
  api = environment.apiUrl;

  // '' = todos, 'pendiente' o 'recogido'
  filtro = signal('');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.adminService.listarReportes(this.filtro()).subscribe();
  }

  filtrar(estado: string) {
    this.filtro.set(estado);
    this.cargar();
  }

  // Si está pendiente lo marca recogido y al revés
  cambiarEstado(reporte: ReporteAdmin) {
    const nuevo = reporte.estado === 'pendiente' ? 'recogido' : 'pendiente';
    this.adminService.cambiarEstadoReporte(reporte.id, nuevo).subscribe(() => {
      // Si hay un filtro activo, recargamos para que el reporte salga de la lista
      if (this.filtro()) this.cargar();
    });
  }
}