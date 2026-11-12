import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: 'usuario' | 'admin';
  activo: boolean;
}

interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

@Service()
export class AuthService {
  private http = inject(HttpClient);

  // Usuario logueado. Se lee del localStorage para no perderlo al recargar
  usuario = signal<Usuario | null>(JSON.parse(localStorage.getItem('usuario') ?? 'null'));

  registro(nombre: string, correo: string, clave: string) {
    return this.http.post<Usuario>(`${environment.apiUrl}/registro`, { nombre, correo, clave });
  }

  login(correo: string, clave: string) {
    return this.http.post<RespuestaLogin>(`${environment.apiUrl}/login`, { correo, clave }).pipe(
      // Cuando responde bien, guardamos el token y el usuario
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        this.usuario.set(respuesta.usuario);
      }),
    );
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  esAdmin() {
    return this.usuario()?.rol === 'admin';
  }

  // Header con el token. Lo usan los demás servicios
  encabezados() {
    return { headers: { Authorization: `Bearer ${this.obtenerToken()}` } };
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario.set(null);
  }
}