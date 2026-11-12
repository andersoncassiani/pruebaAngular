import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  // Título que le manda el padre
  titulo = input.required<string>();

  // Avisa al padre que se quiere cerrar (clic afuera o en la X)
  cerrar = output<void>();
}