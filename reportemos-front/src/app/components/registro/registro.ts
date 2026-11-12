import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [FormsModule, RouterLink], // FormsModule para ngModel, RouterLink para el enlace al login
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private auth = inject(AuthService);

  // Campos del formulario (enlazados con ngModel)
  nombre = '';
  correo = '';
  clave = '';

  // Estado de la vista
  error = signal('');
  exito = signal(false); // cuando es true se muestra el mensaje de cuenta creada

  registrar() {
    // Validación básica antes de llamar a la API
    if (!this.nombre || !this.correo || !this.clave) {
      this.error.set('Completa todos los campos');
      return;
    }

    this.error.set('');

    this.auth.registro(this.nombre, this.correo, this.clave).subscribe({
      next: () => this.exito.set(true),
      error: (err) => {
        // Muestro un mensaje según lo que responda el backend
        if (err.status === 400) {
          this.error.set('El correo ya está registrado');
        } else if (err.status === 422) {
          // 422 = no pasó las validaciones del esquema en FastAPI
          this.error.set('Nombre mínimo 3 letras, correo válido y clave mínimo 6 caracteres');
        } else {
          this.error.set('No se pudo conectar con el servidor');
        }
      },
    });
  }
}