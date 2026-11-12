import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reporte, ReportesService } from '../../services/reportes-service';
import { TarjetaReporte } from '../tarjeta-reporte/tarjeta-reporte';
import { Modal } from '../modal/modal';

@Component({
  imports: [FormsModule, TarjetaReporte, Modal],
  selector: 'app-reportes',
  styleUrl: './reportes.css',
  templateUrl: './reportes.html',
})
export class Reportes implements OnInit {
  reportesService = inject(ReportesService);

  // Campos del formulario
  titulo = '';
  descripcion = '';
  direccion = '';

  // Si tiene un id estamos editando, si es null estamos creando
  editandoId = signal<string | null>(null);
  error = signal('');

  // Modal de eliminar: si tiene un id, el modal está abierto
  idAEliminar = signal<string | null>(null);

  ngOnInit() {
    this.reportesService.listar().subscribe();
  }

  // inputFoto: el <input type="file"> del HTML (lo recibimos con #inputFoto)
  guardar(inputFoto: HTMLInputElement) {
    if (!this.titulo || !this.descripcion || !this.direccion) {
      this.error.set('Completa todos los campos');
      return;
    }

    const datos = { titulo: this.titulo, descripcion: this.descripcion, direccion: this.direccion };
    const id = this.editandoId();

    // Si hay id editamos, si no creamos (la foto solo se sube al crear)
    const peticion = id
      ? this.reportesService.editar(id, datos)
      : this.reportesService.crear(datos, inputFoto.files?.[0] ?? null);

    peticion.subscribe({
      next: () => {
        this.limpiar();
        inputFoto.value = '';
      },
      error: (err) => {
        // 400 = foto inválida (el backend manda el motivo), 422 = campos muy cortos
        this.error.set(
          err.status === 400 ? err.error.detail : 'Título mínimo 5 letras, descripción mínimo 10 y dirección mínimo 5',
        );
      },
    });
  }

  // Lo llama la tarjeta (hijo) con su output "editar"
  editar(reporte: Reporte) {
    this.editandoId.set(reporte.id);
    this.titulo = reporte.titulo;
    this.descripcion = reporte.descripcion;
    this.direccion = reporte.direccion;
  }

  // Lo llama la tarjeta (hijo) con su output "eliminar": solo abre el modal
  eliminar(id: string) {
    this.idAEliminar.set(id);
  }

  // Lo llama el botón "Eliminar" del modal
  confirmarEliminar() {
    const id = this.idAEliminar();
    if (!id) return;

    this.reportesService.eliminar(id).subscribe(() => this.idAEliminar.set(null));
  }

  limpiar() {
    this.titulo = '';
    this.descripcion = '';
    this.direccion = '';
    this.editandoId.set(null);
    this.error.set('');
  }
}