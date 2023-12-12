import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { CalificacionesCualitativas } from 'src/app/interfaces/CalificacionesCualitativas.interface';
import { CalificacionesCuantitativas } from 'src/app/interfaces/CalificacionesCuantitativas.interface';
import { Parcial } from 'src/app/interfaces/Parcial.interface';
import { Periodo } from 'src/app/interfaces/Periodo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ParcialService } from 'src/app/servicios/parcial.service';
import { PeriodoService } from 'src/app/servicios/periodo.service';
import { ProfesorAsignaturaService } from 'src/app/servicios/profesor-asignatura.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss']
})
export class CalificacionesComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private service: ProfesorAsignaturaService,
    private estudianteCursoParaleloservice: EstudianteCursoParaleloService,
    private anioService: AnioLectivoService,
    private periodoService: PeriodoService,
    private parcialService: ParcialService,
    private usuarioService: UsuarioService,


  ) { }
  title = 'Calificaciones';
  elementoId: string = '';
  PRLL_ID: string = '';
  CRS_ID: string = '';
  USR_ID = this.usuarioService.getUserLoggedId();

  anio: AnioLectivo = {} as AnioLectivo;
  periodosNormales: Periodo[] = [];
  periodosEvaluativos: Periodo[] = [];
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
    const data = { PRLL_ID: this.PRLL_ID, CRS_ID: this.CRS_ID, AL_ID: this.anio.AL_ID, PRF_ASG_PRLL_ID: this.elementoId }
    this.estudianteCursoParaleloservice.getEstudiantesByCursoParalelo(data).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantes = value.data;
          console.log(this.estudiantes);
          
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
          const periodos = value.data as Periodo[];
          this.periodosNormales = periodos.filter(periodo => periodo.PRD_TIPO === 'Normal');
          this.periodosEvaluativos = periodos.filter(periodo => periodo.PRD_TIPO !== 'Normal');
          this.loadParcialesByPeriodo();
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParcialesByPeriodo() {
    this.periodosNormales.map(periodo =>
      this.parcialService.getByPeriodo(periodo.PRD_ID).subscribe({
        next: (value) => {
          if (value.response) {
            const parciales = value.data as Parcial[];
            periodo['colspan'] = parciales.length + 5;
            periodo["parcialesNormales"] = parciales.filter(parcial => parcial.PRCL_TIPO === 'Normal');
            periodo["parcialesEvaluativos"] = parciales.filter(parcial => parcial.PRCL_TIPO !== 'Normal');
          } else {
            console.log(value.message);
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    );

    this.periodosEvaluativos.map(periodo =>
      this.parcialService.getByPeriodo(periodo.PRD_ID).subscribe({
        next: (value) => {
          if (value.response) {
            const parciales = value.data as Parcial[];
            periodo['colspan'] = parciales.length + 5;
            periodo['parcialesNormales'] = parciales.filter(parcial => parcial.PRCL_TIPO === 'Normal');
            periodo['parcialesEvaluativos'] = parciales.filter(parcial => parcial.PRCL_TIPO !== 'Normal');
          } else {
            console.log(value.message);
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    );
  }

  addCalificacion(estudiante: any, parcial: any, event: any) {
    const calificacion = Number(event.target.value);

    if (calificacion > 10 || calificacion < 0) {
      event.target.value = '';
      event.target.style.border = '1px solid red'; // Agrega el estilo al input
      return;
    } else {
      event.target.style.border = ''; // Agrega el estilo al input

      // Check if estudiante['CUANTITATIVAS'] is null or undefined, and initialize it as an empty array if needed
      if (!estudiante['CUANTITATIVAS']) {
        estudiante['CUANTITATIVAS'] = [];
      }

      const filaEncontrada: CalificacionesCuantitativas = estudiante['CUANTITATIVAS'].find((cualitativa: { PRCL_ID: any; }) => cualitativa.PRCL_ID === parcial.PRCL_ID);

      if (filaEncontrada) {
        filaEncontrada.CALIFICACION = calificacion;
        filaEncontrada.ESTADO = '1';
      } else {
        estudiante['CUANTITATIVAS'].push(this.buildobject(estudiante, parcial, calificacion));
      }
    }
  }


  buildobject(estudiante: any, parcial: any, calificacion: any) {
    const objeto: CalificacionesCuantitativas = {
      CAL_ID: '0',
      PRF_ASG_PRLL_ID: this.elementoId,
      EST_CRS_PRLL_ID: estudiante.EST_CRS_PRLL_ID,
      PRCL_ID: parcial.PRCL_ID,
      CALIFICACION: calificacion,
      CREADOR_ID: this.USR_ID,
      ESTADO: '1'
    }
    return objeto;
  }

  isEnabledParcial(parcial: Parcial) {
    const fechaActual = new Date().setHours(0, 0, 0, 0);
    const fechaInicio = new Date(parcial.PRCL_INI).setHours(0, 0, 0, 0);
    const fechaFin = new Date(parcial.PRCL_FIN).setHours(0, 0, 0, 0);
    const response = fechaActual >= fechaInicio && fechaActual <= fechaFin;
    return !response;
  }

  getCalificacion(estudiante: any, parcial: any) {
    let calificacion = 0;
    if (estudiante.CUANTITATIVAS) {
      const filaEncontrada: CalificacionesCuantitativas = estudiante.CUANTITATIVAS.find((cualitativa: { PRCL_ID: any; }) => cualitativa.PRCL_ID === parcial.PRCL_ID);
      if (filaEncontrada) {
        calificacion = filaEncontrada.CALIFICACION;
      }
    }
    return calificacion;

  }

 

  guardar() {
    console.log(this.estudiantes);

  }
}
