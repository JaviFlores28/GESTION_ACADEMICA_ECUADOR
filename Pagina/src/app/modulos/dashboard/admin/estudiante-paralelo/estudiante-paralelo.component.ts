import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { EstudianteCurso } from 'src/app/interfaces/EstudianteCurso.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-estudiante-paralelo',
  templateUrl: './estudiante-paralelo.component.html',
  styleUrls: ['./estudiante-paralelo.component.scss'],
})
export class EstudianteParaleloComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private service: EstudianteCursoParaleloService,
    private cursoService: CursoService,
    private paraleloService: ParaleloService,
    private estudianteCursoService: EstudianteCursoService,
    private usuarioService: UsuarioService,
    private anioService: AnioLectivoService
  ) { }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  estudianteCurso: EstudianteCurso[] = [];
  estudiantesParalelos: EstudianteCursoParalelo[] = [];

  idsEstudianteCurso: string[] = [];
  idsEstudianteCursoParalelo: string[] = [];

  headersEstudianteCurso = ['CÉDULA', 'NOMBRES'];
  camposEstudianteCurso = ['EST_CRS_ID', 'EST_DNI', 'EST_NOM'];
  headersEstudianteCursoParalelo = ['CÉDULA', 'NOMBRES', 'CURSO', 'TIPO', 'PARALELO'];
  camposEstudianteCursoParalelo = ['EST_CRS_PRLL_ID', 'EST_DNI', 'EST_CRS_NOM', 'CRS_NOM', 'CRS_TIPO', 'PRLL_NOM'];

  msg: string = '¿Desea guardar?';
  USR_ID: string = this.usuarioService.getUserLoggedId();
  AL_ID: string = '0';
  PASE: number = 4;
  ESTADO: number = 1;
  existeAnio: boolean = false;
  action: string = '';

  form = this.formBuilder.group({
    CRS_ID: [''],
    PRLL_ID: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadCursos();
    this.loadParalelos();
    this.loadAnioLectivo();
    this.loadEstudianteParalelo();
    this.form.get('CRS_ID')?.valueChanges.subscribe((value) => {
      this.loadestudianteCurso(value || '');
    });

    /* this.form.get('PRLL_ID')?.valueChanges.subscribe((value) => {
      this.loadEstudianteParalelo(value || '');
    }); */
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
          this.cursos = this.cursos.map(curso => ({
            ...curso,
            CRS_NOM: `${curso.CRS_NOM} ${curso.CRS_TIPO}`
          }));
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


  loadParalelos() {
    this.paraleloService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.paralelos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadAnioLectivo() {
    this.anioService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.AL_ID = value.data[0].AL_ID;
          this.existeAnio = true;
        } else {
          this.existeAnio = false;
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadestudianteCurso(cursoId: string) {
    this.estudianteCursoService.getByCurso(cursoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudianteCurso = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadEstudianteParalelo() {
    this.service.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantesParalelos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  estudiantesParaleloAction(value: any) {
    this.idsEstudianteCurso = value.data;
    if (value.action === 'desactivar') {
      this.action = value.action;
      this.msg = '¿Desea desactivar los items seleccionados?';
      this.openModal('Desactivar', this.msg, 'warning', false);
    }
  }

  estudianteCursoAction(value: any) {
    this.idsEstudianteCursoParalelo = value.data;
  }

  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudianteCursoParalelo,
        AL_ID: this.AL_ID,
        PRLL_ID: this.form.value.PRLL_ID,
        PASE: this.PASE,
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
    if (this.idsEstudianteCurso.length === 0) {
      this.msg = 'Debe seleccionar al menos un item.'
      this.openModal('Error', this.msg, 'danger', false);
      return;
    }
    this.service.updateEstado(this.idsEstudianteCurso).subscribe({
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
    this.loadEstudianteParalelo();
    // this.router.navigate(['../'], { relativeTo: this.route });
  }

}
