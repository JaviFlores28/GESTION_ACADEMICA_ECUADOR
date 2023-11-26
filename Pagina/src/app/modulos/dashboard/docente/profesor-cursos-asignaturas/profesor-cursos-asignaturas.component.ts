import { Component } from '@angular/core';

@Component({
  selector: 'app-profesor-cursos-asignaturas',
  templateUrl: './profesor-cursos-asignaturas.component.html',
  styleUrls: ['./profesor-cursos-asignaturas.component.scss']
})
export class ProfesorCursosAsignaturasComponent {
  data: any[] = []
  title = 'Asignaturas';
  campos: any[] = []
  headers: any[] = []
  filaAction(value:any) {
    console.log('filaaction')
  }
}
