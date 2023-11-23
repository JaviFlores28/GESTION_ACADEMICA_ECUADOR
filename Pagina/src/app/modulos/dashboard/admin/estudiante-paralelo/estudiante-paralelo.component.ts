import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { EstudianteCurso } from 'src/app/interfaces/EstudianteCurso.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-estudiante-paralelo',
  templateUrl: './estudiante-paralelo.component.html',
  styleUrls: ['./estudiante-paralelo.component.scss']
})
export class EstudianteParaleloComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: EstudianteCursoParaleloService,
    private cursoService: CursoService,
    private paraleloService: ParaleloService,
    private estudianteCursoService: EstudianteCursoService,
    private modalService: ModalService,
    private usuarioService: UsuarioService,

  ) { }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  estudianteCurso: EstudianteCurso[] = [];
  estudiantesParalelos: EstudianteCursoParalelo[] = [];

  idsEstudianteCurso: string[] = [];
  idsEstudianteCursoParalelo: string[] = [];

  headersEstudianteCurso = ['CÉDULA', 'NOMBRES'];
  camposEstudianteCurso = ['EST_CRS_ID', 'EST_DNI', 'EST_ID'];
  headersEstudianteCursoParalelo = ['CÉDULA', 'CURSO', 'NOMBRES', 'ESTADO'];
  camposEstudianteCursoParalelo = ['EST_CRS_PRLL_ID', 'EST_DNI','CRS_ID', 'EST_ID'];

  msg: string = '¿Desea guardar?';
  userId = this.usuarioService.getUserLoggedId();

  form = this.formBuilder.group({
    CRS_ID: [''],
    PRLL_ID: ['', Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos();
    this.loadParalelos();

    this.form.get('CRS_ID')?.valueChanges.subscribe((value) => {
      this.loadestudianteCurso(value || '');
    });

    this.form.get('PRLL_ID')?.valueChanges.subscribe((value) => {
      this.loadEstudianteParalelo(value || '');
    });
  }

  onSubmit() {
    this.openConfirmationModal(this.msg, 'create');
  }

  loadCursos() {
    this.cursoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.cursos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParalelos() {
    this.paraleloService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.paralelos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadestudianteCurso(cursoId: string) {
    this.estudianteCursoService.getByCurso(cursoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudianteCurso = value.data
          console.log(this.estudianteCurso);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadEstudianteParalelo(paraleloId: string) {
    this.service.getByParalelo(paraleloId).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantesParalelos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  estudiantesaction(value: any) {
    this.idsEstudianteCurso = value.data;
    if (value.action === 'desactivar') {
      this.openConfirmationModal('¿Desea desactivar los items seleccionados?', value.action);
    }
  }
  estudianteCursoAction(value: any) {
    this.idsEstudianteCursoParalelo = value.data;
  }

  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudianteCursoParalelo,
        PRLL_ID: this.form.value.PRLL_ID,
        CREADOR_ID: this.userId
      };
      this.service.postMasivo(estudiantes).subscribe(
        {
          next: (value) => {
            this.handleResponse(value);
          },
          error: (error) => this.handleErrorResponse(error)
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  desactivar() {
    if (this.idsEstudianteCurso.length === 0) {
      this.openAlertModal('Debe seleccionar al menos un item.', 'danger');
      return
    }
    this.service.patchUpdateEstado(this.idsEstudianteCurso).subscribe(
      {
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error)
      }
    );
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string, action: string) {
    this.modalService.openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          if (action === 'create') {
            this.crear()
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
      // this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }
}
