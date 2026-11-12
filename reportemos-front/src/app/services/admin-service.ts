import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, Usuario } from './auth-service';
import { Reporte } from './reportes-service';

// El admin ve el reporte y además quién lo hizo
export interface ReporteAdmin extends Reporte {
  usuario: { nombre: string; correo: string };
}

@Service()
export class AdminService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = `${environment.apiUrl}/admin`;

  usuarios = signal<Usuario[]>([]);
  reportes = signal<ReporteAdmin[]>([]);

  // --- Usuarios ---

  listarUsuarios() {
    return this.http
      .get<Usuario[]>(`${this.api}/usuarios`, this.auth.encabezados())
      .pipe(tap((lista) => this.usuarios.set(lista)));
  }

  cambiarEstadoUsuario(id: string, activo: boolean) {
    return this.http
      .put<Usuario>(`${this.api}/usuarios/${id}/estado`, { activo }, this.auth.encabezados())
      .pipe(tap((editado) => this.usuarios.update((lista) => lista.map((u) => (u.id === id ? editado : u)))));
  }

  cambiarClave(id: string, clave: string) {
    return this.http.put(`${this.api}/usuarios/${id}/clave`, { clave }, this.auth.encabezados());
  }

  // --- Reportes ---

  // estado vacío = todos
  listarReportes(estado: string) {
    const filtro = estado ? `?estado=${estado}` : '';
    return this.http
      .get<ReporteAdmin[]>(`${this.api}/reportes${filtro}`, this.auth.encabezados())
      .pipe(tap((lista) => this.reportes.set(lista)));
  }

  cambiarEstadoReporte(id: string, estado: 'pendiente' | 'recogido') {
    return this.http
      .put<ReporteAdmin>(`${this.api}/reportes/${id}/estado`, { estado }, this.auth.encabezados())
      .pipe(tap((editado) => this.reportes.update((lista) => lista.map((r) => (r.id === id ? editado : r)))));
  }
}