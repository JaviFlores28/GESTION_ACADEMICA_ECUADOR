import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent {
  constructor(
    private ngBootstrap: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: CursoService,
    private usuarioService: UsuarioService,
    private modalService: ModalService,
  ) {}

  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  USR_ID = this.usuarioService.getUserLoggedId();

  icon = faInfoCircle;

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    tip: ['', Validators.required],
    orden: [1, Validators.required],
    estado: [true],
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
      const curso: Curso = this.buildObject();
      this.service.post(curso).subscribe({
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
      const curso: Curso = this.buildObjectEdit();
      this.service.put(curso).subscribe({
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
    const curso: Curso = {
      CRS_ID: '0',
      CRS_NOM: this.form.value.nom || '',
      CRS_TIPO: this.form.value.tip || '',
      CRS_ORDEN: this.form.value.orden || 0,
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return curso;
  }

  buildObjectEdit() {
    const curso: Curso = {
      CRS_ID: this.elementoId,
      CRS_NOM: this.form.value.nom || '',
      CRS_TIPO: this.form.value.tip || '',
      CRS_ORDEN: this.form.value.orden || 0,
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return curso;
  }

  loadDataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
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

  llenarForm(data: Curso) {
    this.form.get('nom')?.setValue(data.CRS_NOM);
    this.form.get('tip')?.setValue(data.CRS_TIPO);
    this.form.get('orden')?.setValue(data.CRS_ORDEN);
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
