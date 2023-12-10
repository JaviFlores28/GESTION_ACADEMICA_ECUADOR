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
  periodos: Periodo[] = [];
  periodosEvaluativos: Periodo[] = [];
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

  accionButton(parcial: any, event: any) {
    if (parcial['inputsDisabled']) {
      event.target.innerText = 'Guardar';
      parcial['inputsDisabled'] = false;
    } else {
      this.openConfirmationModal('¿Está seguro de que desea guardar los cambios?', parcial, event);
    }
  }

  buildObject(parcial: any, fechaIni: Date, fechaFin: Date) {
    const parcialEditado: Parcial = {
      PRCL_ID: parcial.PRCL_ID,
      PRCL_NOM: parcial.PRCL_NOM,
      PRCL_INI: fechaIni,
      PRCL_FIN: fechaFin,
      ESTADO: parcial.ESTADO,
      PRD_ID: parcial.PRD_ID,
      PRCL_TIPO: parcial.PRCL_TIPO,
      CREADOR_ID: parcial.CREADOR_ID
    };
    return parcialEditado;
  }

  editar(parcial: any, event: any) {
    let fechaIni = new Date(parcial.PRCL_INI.year, parcial.PRCL_INI.month - 1, parcial.PRCL_INI.day);
    let fechaFin = new Date(parcial.PRCL_FIN.year, parcial.PRCL_FIN.month - 1, parcial.PRCL_FIN.day);
    const parcialEditado = this.buildObject(parcial, fechaIni, fechaFin);
    this.parcialService.put(parcialEditado).subscribe({
      next: (value) => {
        this.handleResponse(parcial, value, event);
      },
      error: (error) => 
      this.handleErrorResponse(parcial, error, event),
    });
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string, parcial: any, event: any) {
    this.modalService
      .openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          this.editar(parcial, event);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(parcial: any, value: any, event: any) {
    if (!value.response) {
      this.handleErrorResponse(parcial, value, event);
    } else {
      this.openAlertModal(value.message, 'success');
      event.target.innerText = 'Editar';
      parcial['inputsDisabled'] = true;
      console.log(value.message);
    }
  }

  handleErrorResponse(parcial: any, error: any, event: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    event.target.innerText = 'Editar';
    parcial['inputsDisabled'] = true;
    console.log(error);
  }
}

