import { Component, OnInit } from '@angular/core';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteService } from 'src/app/servicios/estudiante.service';

@Component({
  selector: 'app-reporte-calificaciones',
  templateUrl: './reporte-calificaciones.component.html',
  styleUrls: ['./reporte-calificaciones.component.scss']
})
export class ReporteCalificacionesComponent implements OnInit {
  constructor(
    private estudianteService: EstudianteService,
  ) { }

  tipo=[{id:'1',label:'Promoción'},{id:'2',label:'Reporte calificaciones por estudiante'},{id:'3',label:'Reporte calificaciones por curso'}];
  estudiantes: Estudiante[] = [];
  aniosLectivos: AnioLectivo[] = [];

  ngOnInit(): void {
    this.loadEstudiantes()
  }

  loadEstudiantes() {
    this.estudianteService.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantes = value.data;
        } else {
          console.log(value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }


}
