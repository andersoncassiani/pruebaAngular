import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Reporte } from '../../services/reportes-service';
import { environment } from '../../../environments/environment';

@Component({
  imports: [DatePipe],
  selector: 'app-tarjeta-reporte',
  styleUrl: './tarjeta-reporte.css',
  templateUrl: './tarjeta-reporte.html',
})
export class TarjetaReporte {
  api = environment.apiUrl;

  // Dato que recibe del padre
  reporte = input.required<Reporte>();

  // Avisos que le manda al padre
  editar = output<Reporte>();
  eliminar = output<string>();
}