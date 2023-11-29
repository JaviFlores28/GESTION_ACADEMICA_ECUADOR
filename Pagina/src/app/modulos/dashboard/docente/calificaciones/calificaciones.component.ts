import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ProfesorAsignaturaService } from 'src/app/servicios/profesor-asignatura.service';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss']
})
export class CalificacionesComponent {
  constructor(private route: ActivatedRoute,
    private service: ProfesorAsignaturaService,
    private estudianteCursoParaleloservice: EstudianteCursoParaleloService,

  ) { }
  title = 'Calificaciones';
  elementoId: string = '';
  PRLL_ID: string = '';
  CRS_ID: string = '';
  AL_ID: string = '';

  ngOnInit(): void {
    this.getId();
    this.llenarDatos();
  }

  getId() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.elementoId = id;
      }
    });
  }

  llenarDatos() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.AL_ID = value.data.AL_ID;
          this.CRS_ID = value.data.CRS_ID;
          this.PRLL_ID = value.data.PRLL_ID;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  llenarTablaEstudiantes() {
    const data = { PRLL_ID: this.PRLL_ID, CRS_ID: this.CRS_ID, AL_ID: this.AL_ID }
    this.estudianteCursoParaleloservice.getEstudiantesByParalelo(data).subscribe({
      next: (value) => {
        if (value.response) {
          console.log(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

}
