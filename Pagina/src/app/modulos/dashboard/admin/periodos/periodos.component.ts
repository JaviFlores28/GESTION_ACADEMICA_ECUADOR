import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { NgbCalendar, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Parcial } from 'src/app/interfaces/Parcial.interface';
import { Periodo } from 'src/app/interfaces/Periodo.interface';
import { ModalService } from 'src/app/servicios/modal.service';
import { I18n, NgDatetimepickerESService } from 'src/app/servicios/ng-datetimepicker-es.service';
import { ParcialService } from 'src/app/servicios/parcial.service';
import { PeriodoService } from 'src/app/servicios/periodo.service';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: NgDatetimepickerESService }]

})
export class PeriodosComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private periodoService: PeriodoService,
    private parcialService: ParcialService,
    private calendar: NgbCalendar,
    private modalService: ModalService,


  ) { }
  periodos: any[] = [];
  today = this.calendar.getToday();
  icon = faCalendarDays;

  ngOnInit(): void {
    this.loadPeriodos();
  }

  loadPeriodos() {
    this.periodoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.periodos = value.data as Periodo[];
          this.periodos.map((periodo: any) => {
            let initial = new Date(periodo.PRD_INI);
            periodo.PRD_INI = {
              year: initial.getUTCFullYear(),
              month: initial.getUTCMonth() + 1, // Los meses en JavaScript empiezan en 0
              day: initial.getUTCDate()
            };
            let fin = new Date(periodo.PRD_FIN);
            periodo.PRD_FIN = {
              year: fin.getUTCFullYear(),
              month: fin.getUTCMonth() + 1, // Los meses en JavaScript empiezan en 0
              day: fin.getUTCDate()
            }
            periodo['inputsDisabled'] = true;
            return periodo;
          })
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
    this.periodos.map(periodo =>
      this.parcialService.getByPeriodo(periodo.PRD_ID).subscribe({
        next: (value) => {
          if (value.response) {
            periodo["parciales"] = value.data as Parcial[];
            periodo["parciales"].map((parcial: any) => {
              let initial = new Date(parcial.PRCL_INI);
              parcial.PRCL_INI = {
                year: initial.getUTCFullYear(),
                month: initial.getUTCMonth() + 1, // Los meses en JavaScript empiezan en 0
                day: initial.getUTCDate()
              };
              let fin = new Date(parcial.PRCL_FIN);
              parcial.PRCL_FIN = {
                year: fin.getUTCFullYear(),
                month: fin.getUTCMonth() + 1, // Los meses en JavaScript empiezan en 0
                day: fin.getUTCDate()
              }
              parcial['inputsDisabled'] = true;
              return parcial;
            });
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

  accionButton(objeto: any, event: any, tipo: string) {
    if (objeto['inputsDisabled']) {
      event.target.innerText = 'Guardar';
      objeto['inputsDisabled'] = false;
    } else {
      this.openModal('Guardar', '¿Desea guardar los cambios?', 'warning', true, objeto, event, tipo);
    }
  }

  buildObjectParcial(parcial: any, fechaIni: Date, fechaFin: Date) {
    const parcialEditado: Parcial = {
      PRCL_ID: parcial.PRCL_ID,
      PRCL_NOM: parcial.PRCL_NOM,
      PRCL_INI: fechaIni,
      PRCL_FIN: fechaFin,
      ESTADO: parcial.ESTADO,
      PRD_ID: parcial.PRD_ID,
      PRCL_TIPO: parcial.PRCL_TIPO,
    };
    return parcialEditado;
  }

  buildObjectPeriodo(periodo: any, fechaIni: Date, fechaFin: Date) {
    const parcialEditado: Periodo = {
      PRD_ID: periodo.PRD_ID,
      PRD_NOM: periodo.PRD_NOM,
      PRD_INI: fechaIni,
      PRD_FIN: fechaFin,
      PRD_TIPO: periodo.PRD_TIPO,
      AL_ID: periodo.AL_ID,
      ESTADO: periodo.ESTADO,
    };
    return parcialEditado;
  }

  editarParcial(parcial: any, event: any) {
    let fechaIni = new Date(parcial.PRCL_INI.year, parcial.PRCL_INI.month - 1, parcial.PRCL_INI.day);
    let fechaFin = new Date(parcial.PRCL_FIN.year, parcial.PRCL_FIN.month - 1, parcial.PRCL_FIN.day);
    const parcialEditado = this.buildObjectParcial(parcial, fechaIni, fechaFin);
    this.parcialService.put(parcialEditado).subscribe({
      next: (value) => {
        this.handleResponse(parcial, value, event);
      },
      error: (error) =>
        this.handleErrorResponse(parcial, error, event),
    });
  }

  editarPeriodo(periodo: any, event: any) {
    let fechaIni = new Date(periodo.PRD_INI.year, periodo.PRD_INI.month - 1, periodo.PRD_INI.day);
    let fechaFin = new Date(periodo.PRD_FIN.year, periodo.PRD_FIN.month - 1, periodo.PRD_FIN.day);
    const periodoEditado = this.buildObjectPeriodo(periodo, fechaIni, fechaFin);
    this.periodoService.put(periodoEditado).subscribe({
      next: (value) => {
        this.handleResponse(periodo, value, event);
      },
      error: (error) =>
        this.handleErrorResponse(periodo, error, event),
    });
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean, objeto?: any, event?: any, tipo?: string) {
    this.modalService.openModal(tittle, message, alertType, form).then((result) => {
      if (result === 'save' && form) {
        if (tipo === 'periodo') {
          this.editarPeriodo(objeto, event)
        } else if (tipo === 'parcial') {
          this.editarParcial(objeto, event);
        }
      }else{
        location.reload();
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(objeto: any, value: any, event: any) {
    if (!value.response) {
      this.handleErrorResponse(objeto, value, event);
    } else {
      this.openModal('¡Completado!', value.message, 'success', false);
      event.target.innerText = 'Editar';
      objeto['inputsDisabled'] = true;
      this.loadPeriodos()
    }
  }

  handleErrorResponse(objeto: any, error: any, event: any) {
    this.openModal('Agregar', error.message, 'success', false);
    event.target.innerText = 'Editar';
    objeto['inputsDisabled'] = true;
    this.loadPeriodos();
    console.log(error);

  }
}

