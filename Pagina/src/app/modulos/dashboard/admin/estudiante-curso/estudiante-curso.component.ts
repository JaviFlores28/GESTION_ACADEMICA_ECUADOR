import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
    private usuarioService: UsuarioService,
    private service: EstudianteCursoService,
    private cursoService: CursoService,
    private modalService: ModalService,
  ) {}

  USR_ID = this.usuarioService.getUserLoggedId();
  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  icon = faInfoCircle;

  cursos: Curso[] = [];
  noMatriculados: Estudiante[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: string[] = [];

  headersNoMatriculados = ['CÉDULA', 'NOMBRES'];
  camposNoMatriculados = ['EST_ID', 'EST_DNI', 'EST_NOM'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO', 'ESTADO'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_ID', 'CRS_ID'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadCursos();
    this.loadNoMatriculados();
    this.loadMatriculados();
  }

  onSubmit() {
    this.openConfirmationModal(this.msg, 'create');
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
      this.openConfirmationModal('¿Desea desactivar los items seleccionados?', value.action);
    }
  }

  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudiantes,
        CRS_ID: this.form.value.CRS_ID,
        ESTADO: 1,
        CREADOR_ID: this.USR_ID,
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
      this.openAlertModal('Debe seleccionar al menos un item.', 'danger');
      return;
    }
    this.service.patchUpdateEstado(this.idsEstudiantes).subscribe({
      next: (value) => {
        this.handleResponse(value);
      },
      error: (error) => this.handleErrorResponse(error),
    });
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string, action: string) {
    this.modalService
      .openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          if (action === 'create') {
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
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(value.message);
    } else {
      console.log(value.message);
      this.openAlertModal(value.message, 'success');
      this.form.reset();
      this.loadMatriculados();
      this.loadNoMatriculados();
      // this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }
}
