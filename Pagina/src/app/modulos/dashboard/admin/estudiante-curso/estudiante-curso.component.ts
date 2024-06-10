import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-estudiante-curso',
  templateUrl: './estudiante-curso.component.html',
  styleUrls: ['./estudiante-curso.component.scss'],
})
export class EstudianteCursoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private service: EstudianteCursoService,
    private cursoService: CursoService
  ) { }

  cursos: Curso[] = [];
  noMatriculados: Estudiante[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: { id: string, name: string }[] = [];

  headersNoMatriculados = ['CÉDULA', 'NOMBRES'];
  camposNoMatriculados = ['EST_ID', 'EST_DNI', 'EST_NOM'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO', 'TIPO'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_NOM', 'CRS_NOM', 'CRS_TIPO'];

  editItemId: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';
  action: string = '';

  AL_ID: string = '0';
  ESTADO: number = 1;
  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadCursos();
    this.loadNoMatriculados();
    this.loadMatriculados();
  }

  onSubmit() {
    this.action = 'create';
    this.openModal('Guardar', this.modalMsg, 'warning', true);
  }

  loadCursos() {
    this.cursoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.cursos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadNoMatriculados() {
    this.service.getNoMatriculados().subscribe({
      next: (value) => {
        if (value.response) {
          this.noMatriculados = value.data;
        } else {
          this.noMatriculados = [];
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadMatriculados() {
    this.service.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.matriculas = value.data;
        } else {
          this.matriculas = [];
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  estudiantesaction(value: any) {
    this.idsEstudiantes = value.data;
  }

  matriculasAction(value: any) {
    this.idsEstudiantes = value.data;
    if (value.action === 'desactivar') {
      this.action = value.action;
      this.modalMsg = '¿Desea desactivar los items seleccionados?';
      this.openModal('Desactivar', this.modalMsg, 'warning', true);
    } else if (value.action === 'eliminar') {
      this.action = value.action;
      this.modalMsg = '¿Desea eliminar los items seleccionados?';
      this.openModal('Eliminar', this.modalMsg, 'warning', true);
    }
  }

  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudiantes.map(item => item.id),
        CRS_ID: this.form.value.CRS_ID,
        ESTADO: this.ESTADO,
      };
      this.service.postMasivo(estudiantes).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  desactivarMatricula() {
    if (this.idsEstudiantes.length === 0) {
      this.modalMsg = 'Debe seleccionar al menos un item.'
      this.openModal('Error', this.modalMsg, 'danger', false);
      return;
    }
    let datos = this.idsEstudiantes.map(item => item.id);
    this.service.updateEstado(datos).subscribe({
      next: (value) => {
        this.handleResponse(value);
      },
      error: (error) => this.handleErrorResponse(error),
    });
  }

  async eliminarMatricula() {
    if (this.idsEstudiantes.length !== 0) {
      const errors: string[] = [];
      try {
        for (const element of this.idsEstudiantes) {
          const response = await lastValueFrom(this.service.delete(element['id']));
          if (!response.response) {
            errors.push(`Error en la eliminación de ${element['name']}: ${response.message}`);
            break; // Detener en el primer error
          }
        }

        if (errors.length > 0) {
          const errorMessage = errors.join('\n');
          this.openModal('Oops...', errorMessage, 'danger', false);
        } else {
          this.openModal('¡Eliminado!', 'Eliminación exitosa', 'success', false);
        }
        this.clear();
      } catch (error) {
        console.log(error);
      }
    }
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.action === 'create') {
            this.crear();
          } else if (this.action === 'desactivar') {
            this.desactivarMatricula();
          } else if (this.action === 'eliminar') {
            this.eliminarMatricula();
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
      this.clear();
      this.openModal('¡Completado!', value.message, 'success', false);
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    this.form.reset();
    this.loadMatriculados();
    this.loadNoMatriculados();
    this.idsEstudiantes = [];
    // this.router.navigate(['../'], { relativeTo: this.route });
  }
}
