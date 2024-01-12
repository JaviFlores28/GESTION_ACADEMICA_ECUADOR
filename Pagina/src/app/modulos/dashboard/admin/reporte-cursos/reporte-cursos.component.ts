import { Component } from '@angular/core';

@Component({
  selector: 'app-reporte-cursos',
  templateUrl: './reporte-cursos.component.html',
  styleUrls: ['./reporte-cursos.component.scss']
})
export class ReporteCursosComponent {
  tipo = [{ id: '1', label: 'Lista de estudiante por curso' }, { id: '2', label: 'Lista de profesores' }, { id: '3', label: 'Lista de estudiantes por curso y paralelos'},{ id: '4', label: 'Lista de cursos y paralelos'} ];

}
