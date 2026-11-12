import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportesService } from '../../services/reportes-service';

@Component({
  imports: [RouterLink],
  selector: 'app-escritorio',
  styleUrl: './escritorio.css',
  templateUrl: './escritorio.html',
})
export class Escritorio implements OnInit {
  private reportesService = inject(ReportesService);

  // computed: se recalcula solo cuando cambia la lista de reportes
  total = computed(() => this.reportesService.reportes().length);
  pendientes = computed(() => this.reportesService.reportes().filter((r) => r.estado === 'pendiente').length);
  recogidos = computed(() => this.reportesService.reportes().filter((r) => r.estado === 'recogido').length);

  ngOnInit() {
    this.reportesService.listar().subscribe();
  }
}