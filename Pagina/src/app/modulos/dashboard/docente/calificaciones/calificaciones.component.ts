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
import { ReporteService } from 'src/app/servicios/reporte.service';
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
    private escalasService: EscalasReferencialesCalificacionesService,
    private reporteServicio: ReporteService
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

  inputClass(parcial: Parcial) {
    if (this.isEnabledParcial(parcial)) {
      return 'bg-white border-0';
    }
    return 'border border-dark-subtle';
  }

  isEnabledParcial(parcial: Parcial) {
    const fechaActual = new Date().setHours(0, 0, 0, 0);
    const fechaInicio = new Date(parcial.PRCL_INI).setHours(0, 0, 0, 0);
    const fechaFin = new Date(parcial.PRCL_FIN).setHours(0, 0, 0, 0);
    const response = fechaActual >= fechaInicio && fechaActual <= fechaFin;
    return !response;
  }

  calcularPromedio(periodo: any, tipo: string): number {
    try {
      const divisor: number = (tipo === 'Normal') ? this.anio.NUM_PRCL : this.anio.NUM_EXAM;

      if (!periodo.parciales) {
        return 0;
      }

      const calificaciones = periodo.parciales.filter((parcial: any) => parcial.PRCL_TIPO === tipo && parcial.CALIFICACION !== '-');

      if (calificaciones.length !== divisor) {
        return 0;
      }

      const suma: number = calificaciones.reduce((acc: number, parcial: any) => acc + parseFloat(parcial.CALIFICACION), 0);

      const calculo: number = parseFloat((suma / divisor).toFixed(2));
      return isNaN(calculo) || calculo === 0 ? 0 : calculo;
    } catch (error) {
      return 0;
    }
  }

  calcularPorcentaje(periodo: any, tipo: string): number {
    try {
      if (!periodo.parciales) {
        return 0;
      }

      const porcentaje: number = (tipo === 'Normal') ? Number(this.anio.AL_POR_PRD) : Number(this.anio.AL_POR_EXAM);
      const promedio = this.calcularPromedio(periodo, tipo);

      if (promedio === 0) {
        return promedio;
      }

      const respuesta = (promedio * porcentaje / 100).toFixed(2);
      return respuesta === 'NaN' ? 0 : Number(respuesta);
    } catch (error) {
      return 0;
    }
  }

  calcularTotal(periodo: any): number {
    try {
      const totalNormal = Number(this.calcularPorcentaje(periodo, 'Normal')) || 0;
      const totalEvaluativo = Number(this.calcularPorcentaje(periodo, 'Evaluativo')) || 0;

      const total: number = totalNormal + totalEvaluativo;

      return (isNaN(total) || total === 0) ? 0 : parseFloat(total.toFixed(2));
    } catch (error) {
      return 0;
    }
  }

  asignarEscalaReferencial(periodo: any, tipo?: string) {
    let total = (tipo) ? periodo : Number(this.calcularTotal(periodo));
    let resultado = '-';
    if (total === 0) {
      return resultado;
    }
    this.escalas.forEach(escala => {
      if (total >= escala.ESCL_INI && total <= escala.ESCL_FIN) {
        resultado = escala.ESCL_ABRV
      }
    });
    return resultado;
  }

  calcularPromedioAnual(periodos: any): { promedio: number, tipo: string } {
    // Filtrar los periodos normales
    const normales = periodos.filter((periodo: any) => periodo.PRD_TIPO === 'Normal');

    // Filtrar los periodos suspensos
    const evaluativos = periodos.filter((periodo: any) => periodo.PRD_TIPO === 'Suspenso');

    let totalNormal = 0;

    // Calcular el total para los periodos 'Normal'
    normales.forEach((periodo: any) => {
      totalNormal += Number(this.calcularTotal(periodo)) || 0;
    });

    // Calcular el promedio para los periodos 'Normal'
    const promedioNormal = normales.length > 0 ? totalNormal / normales.length : 0;
    // Validar 'Suspenso'
    if (promedioNormal >= this.anio.CLFN_MIN_PERD && promedioNormal < this.anio.CLFN_MIN_APR) {
      // Calcular el total para los periodos 'Suspenso'
      let existePase = this.validarPaseSuspenso(evaluativos[0]);
      // Verificar si el promedio de 'Suspenso' cumple con el requisito mínimo
      if (existePase) {
        return { promedio: parseFloat(this.anio.CLFN_MIN_APR.toFixed(2)), tipo: 'suspenso' };
      }

      // Si no cumple, devolver el promedio de 'Normal'
      return { promedio: parseFloat(promedioNormal.toFixed(2)), tipo: 'normal' };


    } else if (promedioNormal < this.anio.CLFN_MIN_PERD) {
      // Validar 'Perdida'
      return { promedio: parseFloat(promedioNormal.toFixed(2)), tipo: 'normal' };
    }

    // Devolver el promedio de 'Normal' por defecto
    return { promedio: parseFloat(promedioNormal.toFixed(2)), tipo: 'normal' };
  }

  validarPaseSuspenso(periodo: any) {
    try {
      const divisor: number = this.anio.NUM_SUSP;

      if (!periodo.parciales) {
        return false;
      }

      const calificaciones = periodo.parciales;

      if (calificaciones.length !== divisor) {
        return false;
      }
      return calificaciones.some((parcial: any) => parseFloat(parcial.CALIFICACION) >= this.anio.CLFN_MIN_APR);
    } catch (error) {
      return false;
    }
  }

  addCalificacion(parcial: any, estudiante: any, event: any, tipo: string, periodos?: any) {
    if (!this.validarCalificacion(parcial, tipo, event)) {
      return;
    }
    if (periodos) {
      const reprobadoSuspenso = this.tieneSuspenso(periodos, parcial);
      if (!reprobadoSuspenso.response) {
        this.handleInvalidInput(event, reprobadoSuspenso.modalMsg);
        event.target.style.border = '';
        event.target.disabled = true;
        return;
      }
      parcial.CALIFICACION = event.target.value;

    }
    if (this.isEnabledParcial(parcial)) {
      this.handleInvalidInput(event, 'El parcial se encuentra cerrado');
      event.target.style.border = '';
      event.target.disabled = true;
      return;
    }
    if (tipo === 'cuantitativa') {
      const calificacion = this.buildobject(parcial, estudiante);
      calificacion.CAL_ID === '0' ? this.crear(calificacion) : this.editar(calificacion);
    }
  }

  validarCalificacion(parcial: any, tipo: string, event: any) {
    const valor = parcial.CALIFICACION
    if (isNaN(valor) || valor < 0 || valor > 10) {
      this.handleInvalidInput(event);
      return false;
    }
    return true;
  }

  tieneSuspenso(periodos: any, parcial: any) {
    const respuesta = this.calcularPromedioAnual(periodos);
    const promedio = respuesta.promedio;
    const tipoPromedio = respuesta.tipo;

    if (promedio <= this.anio.CLFN_MIN_PERD) {
      return { response: false, modalMsg: 'El estudiante se encuentra reprobado' };
    }
    if ((tipoPromedio === 'normal' && promedio >= this.anio.CLFN_MIN_APR) || parcial.CALIFICACION === 0) {
      return { response: false, modalMsg: 'El estudiante no se encuentra en suspenso' };
    }
    return { response: true, modalMsg: 'El estudiante se encuentra en suspenso' };
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
      ESTADO: 1
    }
    return objeto;
  }

  showToast(valor: boolean) {
    this.mostrarToast = valor;
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
    this.modalService.openModal('Error', 'Ha ocurrido un error intente nuevamente.', 'danger', false)

    this.loadTablaEstudiantes();
    console.log(error);
  }

  handleInvalidInput(event: any, modalMsg: string = 'La calificación debe ser entre 0 y 10') {
    event.target.value = '';
    event.target.style.border = '1px solid red';
    this.backgroundToast = 'bg-danger';
    this.mensajeToast = modalMsg;
    this.showToast(true);
    this.loadTablaEstudiantes();
  }

  generarPdf() {
    const table = document.getElementById('table');
    const clonedTable = table?.cloneNode(true) as HTMLElement;
    clonedTable.style.fontSize = '0.7rem';
    clonedTable.style.width = '100%';
    clonedTable.style.borderSpacing = '0';
    clonedTable.style.borderCollapse = 'collapse';
    const trElements = clonedTable?.querySelectorAll('th, td');

    trElements?.forEach((element: any) => {
      element.style.borderColor = 'black';
      element.style.borderStyle = 'solid';
      element.style.borderWidth = '1px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.overflow = 'hidden';
      element.style.wordBreak = 'normal';
      element.style.textAlign = 'center';
      if (element.classList.contains('bg-body-secondary')) {
        element.style.backgroundColor = '#C0C0C0'; // Cambia el color de fondo a un tono más oscuro
      }
    });


    const inputs = clonedTable?.querySelectorAll('td input');

    inputs?.forEach((input: any) => {
      const inputValue = input.value; // Obtener el valor del atributo value
      const newContent = document.createTextNode(inputValue); // Crear un nodo de texto con el valor
      // Reemplazar el input con el nodo de texto
      input.parentNode.replaceChild(newContent, input);
    });

    const html = clonedTable?.outerHTML;

    this.reporteServicio.post(html).subscribe({
      next: (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'reporte.pdf';
        link.click();
      },
      error: (error) => this.handleErrorResponse(error),
    });

  }
}