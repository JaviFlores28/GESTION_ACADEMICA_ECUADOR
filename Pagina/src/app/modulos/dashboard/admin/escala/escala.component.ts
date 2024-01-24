import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EscalasReferencialesCalificaciones } from 'src/app/interfaces/EscalasReferencialesCalificaciones.interface';
import { EscalasReferencialesCalificacionesService } from 'src/app/servicios/escalas-referenciales-calificaciones.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-escala',
  templateUrl: './escala.component.html',
  styleUrls: ['./escala.component.scss']
})
export class EscalaComponent {
  constructor(
    private formBuilder: FormBuilder,
    private service: EscalasReferencialesCalificacionesService,
    private route: ActivatedRoute,
    private modalService: ModalService,
  ) { }
  modoEdicion: boolean = false;
  elementoId: string = '';
  hasImage: boolean = false;
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';

  form = this.formBuilder.group({
    ESCL_ABRV: ['', Validators.required],
    ESCL_DESCR: ['', Validators.required],
    ESCL_INI: [0, Validators.required],
    ESCL_FIN: [0, Validators.required],
  });

  ngOnInit(): void {
    this.validarEdicion();
  }
  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  loadataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        this.llenarForm(value.data);
      },
      error(err) {
      },
    })
  }

  llenarForm(data: EscalasReferencialesCalificaciones) {
    this.form.get('ESCL_ABRV')?.setValue(data.ESCL_ABRV);
    this.form.get('ESCL_DESCR')?.setValue(data.ESCL_DESCR);
    this.form.get('ESCL_INI')?.setValue(data.ESCL_INI);
    this.form.get('ESCL_FIN')?.setValue(data.ESCL_FIN);
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.modoEdicion) {
            this.editar();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editar() {
    if (this.form.valid) {
      const parametro: EscalasReferencialesCalificaciones = this.buildObjectEdit();
      this.service.put(parametro).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObjectEdit() {
    const parametro: EscalasReferencialesCalificaciones = {
      ESTADO: 1,
      ESCL_ID: this.elementoId,
      ESCL_ABRV: this.form.value.ESCL_ABRV || '',
      ESCL_DESCR: this.form.value.ESCL_DESCR || '',
      ESCL_INI: this.form.value.ESCL_INI || 0,
      ESCL_FIN: this.form.value.ESCL_FIN || 0,
    };
    return parametro;
  }

  handleResponse(value: any) {
    if (!value.response) {
      //'Ha ocurrido un error intente nuevamente.'
      this.openModal('Oops...', value.message, 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
      } else {
        this.openModal('¡Completado!', value.message, 'success', false);
        //this.clear();
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

}

