import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import { AuthService, Usuario } from '../../services/auth-service';
import { Modal } from '../modal/modal';

@Component({
  imports: [FormsModule, Modal],
  selector: 'app-admin-usuarios',
  styleUrl: './admin-usuarios.css',
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios implements OnInit {
  adminService = inject(AdminService);
  auth = inject(AuthService);

  mensaje = signal('');

  // Modal de cambiar clave: si tiene un usuario, el modal está abierto
  usuarioClave = signal<Usuario | null>(null);
  nuevaClave = '';
  errorClave = signal('');

  ngOnInit() {
    this.adminService.listarUsuarios().subscribe();
  }

  // Si está activo lo desactiva y al revés
  cambiarEstado(usuario: Usuario) {
    this.adminService.cambiarEstadoUsuario(usuario.id, !usuario.activo).subscribe();
  }

  abrirModalClave(usuario: Usuario) {
    this.usuarioClave.set(usuario);
    this.nuevaClave = '';
    this.errorClave.set('');
  }

  cerrarModalClave() {
    this.usuarioClave.set(null);
  }

  guardarClave() {
    const usuario = this.usuarioClave();
    if (!usuario) return;

    if (this.nuevaClave.length < 6) {
      this.errorClave.set('La clave debe tener mínimo 6 caracteres');
      return;
    }

    this.adminService.cambiarClave(usuario.id, this.nuevaClave).subscribe(() => {
      this.mensaje.set(`Clave de ${usuario.nombre} actualizada`);
      this.cerrarModalClave();
    });
  }
}