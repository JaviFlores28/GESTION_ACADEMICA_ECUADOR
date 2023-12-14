import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { CalificacionesCuantitativas } from 'src/app/interfaces/CalificacionesCuantitativas.interface';
import { EscalasReferencialesCalificaciones } from 'src/app/interfaces/EscalasReferencialesCalificaciones.interface';
import { Parcial } from 'src/app/interfaces/Parcial.interface';

import { Periodo } from 'src/app/interfaces/Periodo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { CalififcacionCuantitativaService } from 'src/app/servicios/calififcacion-cuantitativa.service';
import { EscalasReferencialesCalificacionesService } from 'src/app/servicios/escalas-referenciales-calificaciones.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ModalService } from 'src/app/servicios/modal.service';
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
    private usuarioService: UsuarioService,
    private calificacioncuantitativaService: CalififcacionCuantitativaService,
    private modalService: ModalService,
    private escalasService: EscalasReferencialesCalificacionesService
  ) { }
  title = 'Calificaciones';
  elementoId: string = '';
  PRLL_ID: string = '';
  CRS_ID: string = '';
  USR_ID = this.usuarioService.getUserLoggedId();
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  backgroundToast: string = 'bg-success';
  anio: AnioLectivo = {} as AnioLectivo;
  periodosNormales: Periodo[] = [];
  periodosEvaluativos: Periodo[] = [];
  estudiantes: any[] = [];
  escalas: EscalasReferencialesCalificaciones[] = [];

  ngOnInit(): void {
    this.getId();
    this.loadProfesorAsignatura();
  }

  getId() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.elementoId = id;
      }
    });
  }

  loadProfesorAsignatura() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.anio.AL_ID = value.data.AL_ID;
          this.CRS_ID = value.data.CRS_ID;
          this.PRLL_ID = value.data.PRLL_ID;
          this.loadAnio();
          this.loadTablaEstudiantes();
          this.loadEscalas();
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

  loadEscalas() {
    this.escalasService.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.escalas = value.data;
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
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  isEnabledParcial(parcial: Parcial) {
    const fechaActual = new Date().setHours(0, 0, 0, 0);
    const fechaInicio = new Date(parcial.PRCL_INI).setHours(0, 0, 0, 0);
    const fechaFin = new Date(parcial.PRCL_FIN).setHours(0, 0, 0, 0);
    const response = fechaActual >= fechaInicio && fechaActual <= fechaFin;
    return !response;
  }

  addCalificacion(parcial: any, estudiante: any, event: any, tipo: string) {
    if (!this.validarCalificacion(parcial, tipo,event)) {
      return;
    }

    if (tipo === 'cuantitativa') {
      const calificacion = this.buildobject(parcial, estudiante);
      calificacion.CAL_ID === '0' ? this.crear(calificacion) : this.editar(calificacion);
    }
  }

  validarCalificacion(parcial: any, tipo: string,event:any) {
    const valor = parcial.CALIFICACION
    if (isNaN(valor) || valor < 0 || valor > 10) {
      this.handleInvalidInput(event);
      return false;
    }
    return true;
  }

  crear(calificacion: any) {
    this.calificacioncuantitativaService.post(calificacion).subscribe({
      next: (response) => {
        this.handleResponse(response);
      },
      error: (error) =>
        this.handleErrorResponse(error),
    });

  }

  editar(calificacion: any) {
    this.calificacioncuantitativaService.put(calificacion).subscribe({
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

  calcularPromedio(periodo: any, tipo: string): number | string {
    try {
      const divisor: number = (tipo === 'Normal') ? this.anio.NUM_PRCL : this.anio.NUM_EXAM;

      if (!periodo.parciales) {
        return '-';
      }

      const calificaciones = periodo.parciales.filter((parcial: any) => parcial.PRCL_TIPO === tipo && parcial.CALIFICACION !== '-');

      if (calificaciones.length !== divisor) {
        return '-';
      }

      const suma: number = calificaciones.reduce((acc: number, parcial: any) => acc + parseFloat(parcial.CALIFICACION), 0);

      const calculo: number = parseFloat((suma / divisor).toFixed(2));

      return isNaN(calculo) || calculo === 0 ? '-' : calculo.toFixed(2);
    } catch (error) {
      return '-';
    }
  }

  calcularPorcentaje(periodo: any, tipo: string): number | string {
    try {
      if (!periodo.parciales) {
        return '-';
      }

      const porcentaje: number = (tipo === 'Normal') ? Number(this.anio.AL_POR_PRD) : Number(this.anio.AL_POR_EXAM);
      const promedio = this.calcularPromedio(periodo, tipo);

      if (promedio === '-' || promedio === 0) {
        return '-';
      }

      const respuesta = (Number(promedio) * porcentaje / 100).toFixed(2);
      return respuesta;
    } catch (error) {
      return '-';
    }
  }

  calcularTotal(periodo: any): number | string {
    try {
      const totalNormal = Number(this.calcularPorcentaje(periodo, 'Normal')) || 0;
      const totalEvaluativo = Number(this.calcularPorcentaje(periodo, 'Evaluativo')) || 0;

      const total: number = totalNormal + totalEvaluativo;

      return (isNaN(total) || total === 0) ? '-' : total.toFixed(2);
    } catch (error) {
      return '-';
    }
  }

  asignarEscalaReferencial(periodo: any) {
    let total = Number(this.calcularTotal(periodo));
    let resultado = '-';
    this.escalas.forEach(escala => {
      if (total >= escala.ESCL_INI && total <= escala.ESCL_FIN) {
        resultado = escala.ESCL_ABRV
      }
    });
    return resultado;
  }

  showToast(valor: boolean) {
    this.mostrarToast = valor;
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  handleResponse(response: any) {
    if (!response.data) {
      this.handleErrorResponse(response.message)
    } else {
      this.backgroundToast = 'bg-success';
      this.mensajeToast = response.message;
      this.showToast(true);
      this.loadTablaEstudiantes();
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    this.loadTablaEstudiantes();
    console.log(error);
  }

  handleInvalidInput(event: any, msg: string = 'La calificación debe ser entre 0 y 10') {
    event.target.value = '';
    event.target.style.border = '1px solid red';
    this.backgroundToast = 'bg-danger';
    this.mensajeToast = msg;
    this.showToast(true);
    this.loadTablaEstudiantes();
  }
}