import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { CalificacionesCuantitativas } from 'src/app/interfaces/CalificacionesCuantitativas.interface';
import { Parcial } from 'src/app/interfaces/Parcial.interface';

import { Periodo } from 'src/app/interfaces/Periodo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ModalService } from 'src/app/servicios/modal.service';
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
    private modalService: ModalService,

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
          this.loadAnio();
          this.loadTablaEstudiantes();

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

  addCalificacion(parcial: any, estudiante: any, event: any, tipo: string) {
    if (event.target.value > 10 || event.target.value < 0 || !event.target.value) {
      parcial.CALIFICACION = '-';
      event.target.value = '';
      event.target.style.border = '1px solid red'; // Agrega el estilo al input
      console.log(parcial);
      return;
    }
    if (tipo === 'cuantitativa') {
      const calificacion = this.buildobject(parcial, estudiante)
      if (calificacion.CAL_ID === '0') {
        this.crear(calificacion);
      } else {
        this.editar(calificacion);
      }
    }
  }

  crear(calificacion: any) {
    this.service.post(calificacion).subscribe({
      next: (response) => {
        this.handleResponse(response);
      },
      error: (error) =>
        this.handleErrorResponse(error),
    });

  }

  editar(calificacion: any) {
    this.service.put(calificacion).subscribe({
      next: (response) => {
        this.handleResponse(response);
      },
      error: (error) =>
        this.handleErrorResponse(error),
    });
  }

  buildobject(parcial: any, estudiante: any) {
    const objeto: CalificacionesCuantitativas = {
      CAL_ID: parcial.CAL_ID,
      PRF_ASG_PRLL_ID: this.elementoId,
      EST_CRS_PRLL_ID: estudiante,
      PRCL_ID: parcial.PRCL_ID,
      CALIFICACION: parcial.CALIFICACION,
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


  calcularPromedio(periodo: any, tipo: string): number | string {
    let suma: number = 0;
    let divisor: number = (tipo === 'Normal') ? this.anio.NUM_PRCL : this.anio.NUM_EXAM;
    let contador: number = 0;
    if (periodo.parciales) {
      periodo.parciales.filter((parcial: any) => parcial.PRCL_TIPO === tipo).forEach((parcial: any) => {
        if (parcial.CALIFICACION !== '-') {
          suma += parseFloat(parcial.CALIFICACION);
          contador++;
        }
      });
      if ((tipo === 'Normal' && contador !== this.anio.NUM_PRCL) || (tipo !== 'Normal' && contador !== this.anio.NUM_EXAM)) {
        return '-';
      }
      let calculo = parseFloat((suma / divisor).toFixed(2));
      let promedio = isNaN(calculo) || calculo === 0 ? '-' : calculo.toFixed(2);
      return promedio;
    }
    return '-';
  }

  calcularPorcentaje(periodo: any, tipo: string): number | string {
    if (periodo.parciales) {
      let porcentaje: number = (tipo === 'Normal') ? Number(this.anio.AL_POR_PRD) : Number(this.anio.AL_POR_EXAM);
      let promedio = this.calcularPromedio(periodo, tipo);
      if (promedio === '-' || promedio === 0) {
        return '-';
      }
      let respuesta = (Number(promedio) * porcentaje / 100).toFixed(2);
      return respuesta;
    }
    return '-';
  }

  calcularTotal(periodo: any) {
    let totalNormal = Number(this.calcularPorcentaje(periodo, 'Normal')) || 0;
    let totalEvaluativo = Number(this.calcularPorcentaje(periodo, 'Evaluativo')) || 0;
    let total: number = totalNormal + totalEvaluativo;
    return (isNaN(total) || total === 0) ? '-' : total.toFixed(2);
  }

  guardar() { }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  handleResponse(response: any) {
    if (!response.data) {
      this.handleErrorResponse(response.message)
    } else {
      this.openAlertModal(response.message, 'success');
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }
}