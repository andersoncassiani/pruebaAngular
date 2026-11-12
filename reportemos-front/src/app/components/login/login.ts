import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [FormsModule, RouterLink], // FormsModule para ngModel, RouterLink para el enlace al registro
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router); // para redirigir al escritorio después del login

  // Campos del formulario (enlazados con ngModel)
  correo = '';
  clave = '';

  // Estado de la vista
  error = signal('');
  cargando = signal(false); // deshabilita el botón mientras responde la API

  ingresar() {
    // Validación básica antes de llamar a la API
    if (!this.correo || !this.clave) {
      this.error.set('Completa todos los campos');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    // El servicio guarda el token y el usuario; aquí solo redirijo
    this.auth.login(this.correo, this.clave).subscribe({
      next: () => this.router.navigate(['/escritorio']),
      error: (err) => {
        // Muestro un mensaje según lo que responda el backend
        if (err.status === 401) {
          this.error.set('Correo o clave incorrectos');
        } else if (err.status === 403) {
          // 403 = el admin desactivó la cuenta
          this.error.set('Tu cuenta está desactivada. Comunícate con el administrador');
        } else {
          this.error.set('No se pudo conectar con el servidor');
        }
        this.cargando.set(false);
      },
    });
  }
}