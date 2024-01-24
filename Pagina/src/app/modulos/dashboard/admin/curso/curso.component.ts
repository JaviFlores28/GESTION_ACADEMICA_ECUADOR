import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { MyValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: CursoService,
    private modalService: ModalService,
  ) { }

  modoEdicion: boolean = false;
  editItemId: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';


  icon = faInfoCircle;

  form = this.formBuilder.group({
    nom: ['', MyValidators.required],
    tip: ['', MyValidators.required],
    orden: [1, MyValidators.required],
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
        this.editItemId = id;
        this.modaltitle = 'Editar';
        this.modalMsg = '¿Desea editar el registro?'; this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.editItemId = '';
      }
    });
  }

  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
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
      CRS_ID: this.editItemId,
      CRS_NOM: this.form.value.nom || '',
      CRS_TIPO: this.form.value.tip || '',
      CRS_ORDEN: this.form.value.orden || 0,
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return curso;
  }

  loadDataEdit() {
    this.service.getById(this.editItemId).subscribe({
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
    this.form.reset();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
