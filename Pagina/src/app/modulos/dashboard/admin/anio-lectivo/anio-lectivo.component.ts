import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { getFormattedDate } from 'src/app/sistema/variables/variables';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-anio-lectivo',
  templateUrl: './anio-lectivo.component.html',
  styleUrls: ['./anio-lectivo.component.scss'],
})
export class AnioLectivoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private service: AnioLectivoService,
    private modalService: ModalService,
  ) {}

  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  USR_ID = this.usuarioService.getUserLoggedId();

  form = this.formBuilder.group({
    AL_NOM: ['', Validators.required],
    AL_INICIO: [getFormattedDate(new Date()), Validators.required],
    AL_FIN: [getFormattedDate(new Date()), Validators.required],
    PRD_NOM:['Trimestre', Validators.required],
    AL_POR_PRD: [70, Validators.required],
    AL_POR_EXAM: [30, Validators.required],
    CLFN_MIN_APR: [7, Validators.required],
    CLFN_MIN_PERD: [5, Validators.required],
    NUM_PRD: [2, Validators.required],
    NUM_EXAM: [1, Validators.required],
    NUM_PRCL: [3, Validators.required],
    NUM_SUSP: [1, Validators.required],
    ESTADO: [true],
  });

  ngOnInit(): void {
    this.validarEdicion();
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.msg = '¿Desea editar?';
        this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openConfirmationModal(this.msg);
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
      ESTADO: this.form.value.ESTADO ? 1 : 0,
      CREADOR_ID: this.USR_ID || '',
    };
    return aniolectivo;
  }

  buildObjectEdit() {
    const aniolectivo: AnioLectivo = {
      AL_ID: this.elementoId,
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
      CREADOR_ID: this.USR_ID,
    };
    return aniolectivo;
  }

  loadDataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
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
    this.USR_ID = data.CREADOR_ID;
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string) {
    this.modalService
      .openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
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
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openAlertModal(value.message, 'success');
        console.log(value.message);
      } else {
        this.openAlertModal(value.message, 'success');
        this.form.reset();
       // this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }
}
