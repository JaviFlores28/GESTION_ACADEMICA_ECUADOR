import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Area } from 'src/app/interfaces/Area.interface';
import { Asignatura } from 'src/app/interfaces/Asignatura.interface';
import { Curso } from 'src/app/interfaces/Curso.interface';

import { AreaService } from 'src/app/servicios/area.service';
import { AsignaturaService } from 'src/app/servicios/asignatura.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.scss'],
})
export class AsignaturaComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: AsignaturaService,
    private areaService: AreaService,
    private modalService: ModalService,
    private usuarioService: UsuarioService,
  ) {}

  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;
  msg: string = '¿Desea guardar?';
  USR_ID = this.usuarioService.getUserLoggedId();

  areas: Area[] = [];
  cursos: Curso[] = [];

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    cltv: [false, Validators.required],
    area: ['', Validators.required],
    estado: [true],
  });

  ngOnInit(): void {
    this.validarEdicion();
    this.loadAreas();
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
      const asignatura: Asignatura = this.buildObject();
      this.service.post(asignatura).subscribe({
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
      const asignatura: Asignatura = this.buildObjectEdit();
      this.service.put(asignatura).subscribe({
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
    const asignatura: Asignatura = {
      ASG_ID: '1',
      ASG_NOM: this.form.value.nom || '',
      ASG_TIPO: this.form.value.cltv ? '1' : '2',
      AREA_ID: this.form.value.area || '',
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return asignatura;
  }

  buildObjectEdit() {
    const asignatura: Asignatura = {
      ASG_ID: this.elementoId,
      ASG_NOM: this.form.value.nom || '',
      ASG_TIPO: this.form.value.cltv ? '1' : '2',
      AREA_ID: this.form.value.area || '',
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return asignatura;
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

  loadAreas() {
    this.areaService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.areas = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarForm(data: Asignatura) {
    this.form.get('nom')?.setValue(data.ASG_NOM);
    this.form.get('cltv')?.setValue(data.ASG_TIPO === 'CUALITATIVA');
    this.form.get('area')?.setValue(data.AREA_ID);
    this.form.get('estado')?.setValue(data.ESTADO === 1);
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
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }
}
