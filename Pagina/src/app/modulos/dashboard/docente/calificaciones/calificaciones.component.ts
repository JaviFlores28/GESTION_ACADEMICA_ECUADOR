import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { Periodo } from 'src/app/interfaces/Periodo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ParcialService } from 'src/app/servicios/parcial.service';
import { PeriodoService } from 'src/app/servicios/periodo.service';
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
    private anioService: AnioLectivoService,
    private periodoService: PeriodoService,
    private parcialService: ParcialService

  ) { }
  title = 'Calificaciones';
  elementoId: string = '';
  PRLL_ID: string = '';
  CRS_ID: string = '';
  anio: AnioLectivo = {} as AnioLectivo;
  periodos: Periodo[] = [];  
  estudiantes: any[] = [];

  ngOnInit(): void {
    this.getId();
    this.loadDatos();
  }

  getId() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.elementoId = id;
      }
    });
  }

  loadDatos() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.anio.AL_ID = value.data.AL_ID;
          this.CRS_ID = value.data.CRS_ID;
          this.PRLL_ID = value.data.PRLL_ID;
          this.loadTablaEstudiantes();
          this.loadAnio();
          //this.loadParciales();
          this.loadPeriodos();
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadTablaEstudiantes() {
    const data = { PRLL_ID: this.PRLL_ID, CRS_ID: this.CRS_ID, AL_ID: this.anio.AL_ID }
    this.estudianteCursoParaleloservice.getEstudiantesByCursoParalelo(data).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantes = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadAnio() {
    this.anioService.getById(this.anio.AL_ID).subscribe({
      next: (value) => {
        if (value.response) {
          this.anio = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadPeriodos() {
    this.periodoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
         this.periodos= value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadParciales() {
    this.parcialService.getEnabled().subscribe({
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
    });
  }

  addCalificacion(data: any, event: any) {
    const calificacion = Number(event.target.value);
    data.CALIFICACION = calificacion;
    console.log(data);

  }
  getRange(num: number): number[] {
    return Array.from({ length: num }, (_, index) => index);
  }
  getColspan(): number {
    return this.anio.NUM_PRCL + this.anio.NUM_EXAM + 5;
  }

}
