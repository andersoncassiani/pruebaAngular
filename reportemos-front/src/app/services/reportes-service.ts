import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  foto: string | null;
  estado: 'pendiente' | 'recogido';
  creado_en: string;
}

// Lo que se manda al crear o editar
export interface DatosReporte {
  titulo: string;
  descripcion: string;
  direccion: string;
}

@Service()
export class ReportesService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = `${environment.apiUrl}/reportes`;

  // Lista compartida: la usan el escritorio y la página de reportes
  reportes = signal<Reporte[]>([]);

  listar() {
    return this.http
      .get<Reporte[]>(this.api, this.auth.encabezados())
      .pipe(tap((lista) => this.reportes.set(lista)));
  }

  // Se manda como FormData (no JSON) porque puede llevar una foto
  crear(datos: DatosReporte, foto: File | null) {
    const formulario = new FormData();
    formulario.append('titulo', datos.titulo);
    formulario.append('descripcion', datos.descripcion);
    formulario.append('direccion', datos.direccion);
    if (foto) {
      formulario.append('foto', foto);
    }

    return this.http
      .post<Reporte>(this.api, formulario, this.auth.encabezados())
      .pipe(tap((nuevo) => this.reportes.update((lista) => [nuevo, ...lista])));
  }

  editar(id: string, datos: DatosReporte) {
    return this.http
      .put<Reporte>(`${this.api}/${id}`, datos, this.auth.encabezados())
      .pipe(tap((editado) => this.reportes.update((lista) => lista.map((r) => (r.id === id ? editado : r)))));
  }

  eliminar(id: string) {
    return this.http
      .delete(`${this.api}/${id}`, this.auth.encabezados())
      .pipe(tap(() => this.reportes.update((lista) => lista.filter((r) => r.id !== id))));
  }
}