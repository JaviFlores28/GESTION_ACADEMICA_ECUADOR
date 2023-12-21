import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-estudiante-curso',
  templateUrl: './estudiante-curso.component.html',
  styleUrls: ['./estudiante-curso.component.scss'],
})
export class EstudianteCursoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private usuarioService: UsuarioService,
    private service: EstudianteCursoService,
    private cursoService: CursoService
  ) { }

  cursos: Curso[] = [];
  noMatriculados: Estudiante[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: string[] = [];

  headersNoMatriculados = ['CÉDULA', 'NOMBRES'];
  camposNoMatriculados = ['EST_ID', 'EST_DNI', 'EST_NOM'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO', 'TIPO'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_NOM', 'CRS_NOM', 'CRS_TIPO'];

  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  action: string = '';
  USR_ID = this.usuarioService.getUserLoggedId();
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
    this.openModal('Guardar', this.msg, 'success', false);
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
      this.msg = '¿Desea desactivar los items seleccionados?';
      this.openModal('Desactivar', this.msg, 'warning', false);
    } else {
      console.log(value);
    }
  }


  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudiantes,
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

  desactivar() {
    if (this.idsEstudiantes.length === 0) {
      this.msg = 'Debe seleccionar al menos un item.'
      this.openModal('Error', this.msg, 'danger', false);
      return;
    }
    this.service.updateEstado(this.idsEstudiantes).subscribe({
      next: (value) => {
        this.handleResponse(value);
      },
      error: (error) => this.handleErrorResponse(error),
    });
  }

  openModal(tittle: string, message: string, alertType: string, modal: boolean) {
    this.modalService.openModal(tittle, message, alertType, modal)
      .then((result) => {
        if (result === 'save' && modal) {
          if (this.action === 'create') {
            this.crear();
          } else {
            this.desactivar();
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
      this.openModal('Agregar', value.message, 'success', false);
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
