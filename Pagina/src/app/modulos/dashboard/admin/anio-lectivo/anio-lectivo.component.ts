import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { getFormattedDate } from 'src/app/sistema/variables/variables';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { MyValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-anio-lectivo',
  templateUrl: './anio-lectivo.component.html',
  styleUrls: ['./anio-lectivo.component.scss'],
})
export class AnioLectivoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: AnioLectivoService,
    private modalService: ModalService,
  ) { }

  modoEdicion: boolean = false;
  editItemId: string = '';
modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';  


  form = this.formBuilder.group({
    AL_NOM: ['', MyValidators.required],
    AL_INICIO: [getFormattedDate(new Date()), MyValidators.required],
    AL_FIN: [getFormattedDate(new Date()), MyValidators.required],
    PRD_NOM: ['Trimestre', MyValidators.required],
    AL_POR_PRD: [70, MyValidators.required],
    AL_POR_EXAM: [30, MyValidators.required],
    CLFN_MIN_APR: [7, MyValidators.required,MyValidators.calificacion],
    CLFN_MIN_PERD: [5, MyValidators.required,MyValidators.calificacion],
    NUM_PRD: [2, MyValidators.required, MyValidators.soloNumeros],
    NUM_EXAM: [1, MyValidators.required, MyValidators.soloNumeros],
    NUM_PRCL: [3, MyValidators.required],
    NUM_SUSP: [1, MyValidators.required, MyValidators.soloNumeros],
    ESTADO: [true],
  });

  ngOnInit(): void {
    this.validarAnioLectivo();
  }

  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  crear() {
    if (this.form.valid) {
      const aniolectivo: AnioLectivo = this.buildObject();
      this.service.post(aniolectivo).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  editar() {
    if (this.form.valid) {
      const aniolectivo: AnioLectivo = this.buildObjectEdit();
      this.service.put(aniolectivo).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObject() {
    const aniolectivo: AnioLectivo = {
      AL_ID: '0',
      AL_NOM: this.form.value.AL_NOM || '',
      AL_INICIO: this.form.value.AL_INICIO ? new Date(this.form.value.AL_INICIO) : new Date(),
      AL_FIN: this.form.value.AL_FIN ? new Date(this.form.value.AL_FIN) : new Date(),
      AL_POR_PRD: this.form.value.AL_POR_PRD || 70,
      AL_POR_EXAM: this.form.value.AL_POR_EXAM || 30,
      CLFN_MIN_APR: this.form.value.CLFN_MIN_APR || 7,
      CLFN_MIN_PERD: this.form.value.CLFN_MIN_PERD || 5,
      PRD_NOM: this.form.value.PRD_NOM || 'Trimestre',
      NUM_PRD: this.form.value.NUM_PRD || 2,
      NUM_EXAM: this.form.value.NUM_EXAM || 1,
      NUM_PRCL: this.form.value.NUM_PRCL || 3,
      NUM_SUSP: this.form.value.NUM_SUSP || 1,
      ESTADO: this.form.value.ESTADO ? 1 : 0
    };
    return aniolectivo;
  }

  buildObjectEdit() {
    const aniolectivo: AnioLectivo = {
      AL_ID: this.editItemId,
      AL_NOM: this.form.value.AL_NOM || '',
      AL_INICIO: this.form.value.AL_INICIO ? new Date(this.form.value.AL_INICIO) : new Date(),
      AL_FIN: this.form.value.AL_FIN ? new Date(this.form.value.AL_FIN) : new Date(),
      AL_POR_PRD: this.form.value.AL_POR_PRD || 70,
      AL_POR_EXAM: this.form.value.AL_POR_EXAM || 30,
      CLFN_MIN_APR: this.form.value.CLFN_MIN_APR || 7,
      CLFN_MIN_PERD: this.form.value.CLFN_MIN_PERD || 5,
      PRD_NOM: this.form.value.PRD_NOM || 'Trimestre',
      NUM_PRD: this.form.value.NUM_PRD || 2,
      NUM_EXAM: this.form.value.NUM_EXAM || 1,
      NUM_PRCL: this.form.value.NUM_PRCL || 3,
      NUM_SUSP: this.form.value.NUM_SUSP || 1,
      ESTADO: this.form.value.ESTADO ? 1 : 0,
    };
    return aniolectivo;
  }

  validarAnioLectivo() {
    this.service.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.modoEdicion = true;
          this.editItemId = value.data[0].AL_ID;
  this.modaltitle = 'Editar';
        this.modalMsg = '¿Desea editar el registro?';          this.llenarForm(value.data[0]);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  llenarForm(data: AnioLectivo) {
    this.form.get('AL_NOM')?.setValue(data.AL_NOM);
    this.form.get('AL_INICIO')?.setValue(getFormattedDate(data.AL_INICIO));
    this.form.get('AL_FIN')?.setValue(getFormattedDate(data.AL_FIN));
    this.form.get('AL_POR_PRD')?.setValue(data.AL_POR_PRD);
    this.form.get('AL_POR_EXAM')?.setValue(data.AL_POR_EXAM);
    this.form.get('CLFN_MIN_APR')?.setValue(data.CLFN_MIN_APR);
    this.form.get('CLFN_MIN_PERD')?.setValue(data.CLFN_MIN_PERD);
    this.form.get('PRD_NOM')?.setValue(data.PRD_NOM);
    this.form.get('NUM_PRD')?.setValue(data.NUM_PRD);
    this.form.get('NUM_EXAM')?.setValue(data.NUM_EXAM);
    this.form.get('NUM_PRCL')?.setValue(data.NUM_PRCL);
    this.form.get('NUM_SUSP')?.setValue(data.NUM_SUSP);
    this.form.get('ESTADO')?.setValue(data.ESTADO === 1);
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.modoEdicion) {
            this.editar();
          } else {
            this.crear();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(value: any) {
    if (!value.response) {
      this.openModal('Oops...', 'Ha ocurrido un error intente nuevamente.', 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
      } else {
        this.clear();
        this.openModal('¡Completado!', value.message, 'success', false);
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    location.reload();
  }
}
