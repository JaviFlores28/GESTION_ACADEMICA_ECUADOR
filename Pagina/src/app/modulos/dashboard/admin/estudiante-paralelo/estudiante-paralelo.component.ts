import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { EstudianteCurso } from 'src/app/interfaces/EstudianteCurso.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';

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
    private usuarioService: AutentificacionService,
    private anioService: AnioLectivoService
  ) { }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  estudianteCurso: EstudianteCurso[] = [];
  estudiantesParalelos: EstudianteCursoParalelo[] = [];

  idsEstudianteCurso: { id: string, name: string }[] = [];
  idsEstudianteCursoParalelo: { id: string, name: string }[] = [];

  headersEstudianteCurso = ['CÉDULA', 'NOMBRES'];
  camposEstudianteCurso = ['EST_CRS_ID', 'EST_DNI', 'EST_NOM'];
  headersEstudianteCursoParalelo = ['CÉDULA', 'NOMBRES', 'CURSO', 'TIPO', 'PARALELO'];
  camposEstudianteCursoParalelo = ['EST_CRS_PRLL_ID', 'EST_DNI', 'EST_CRS_NOM', 'CRS_NOM', 'CRS_TIPO', 'PRLL_NOM'];

  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';
  USR_ID: string = this.usuarioService.getUserIdLocal();
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
    this.openModal('Guardar', this.modalMsg, 'warning', true);
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
          this.estudianteCurso =[];
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
          this.estudiantesParalelos=[];
          console.log(value.message);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  estudiantesParaleloAction(value: any) {
    this.idsEstudianteCursoParalelo = value.data;
    if (value.action === 'desactivar') {
      this.action = value.action;
      this.modalMsg = '¿Desea desactivar los items seleccionados?';
      this.openModal('Desactivar', this.modalMsg, 'warning', true);
    }
    if (value.action === 'eliminar') {
      this.action = value.action;
      this.modalMsg = '¿Desea eliminar los items seleccionados?';
      this.openModal('Eliminar', this.modalMsg, 'warning', true);
    }
  }

  estudianteCursoAction(value: any) {
    this.idsEstudianteCurso = value.data;
  }

  crear() {
    if (this.form.valid) {
      let estudiantes = {
        arrayIds: this.idsEstudianteCurso.map(element => element.id),
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

  async desactivar() {
    if (this.idsEstudianteCursoParalelo.length === 0) {
      this.modalMsg = 'Debe seleccionar al menos un item.'
      this.openModal('Error', this.modalMsg, 'danger', false);
      return;
    }
    const errors: string[] = [];
    try {
      for (const element of this.idsEstudianteCursoParalelo) {
        const response = await lastValueFrom(this.service.updateEstado(element.id));
        if (!response.response) {
          errors.push(`Error en el cambio de estado de ${element['name']}: ${response.message}`);
          break; // Detener en el primer error
        }
      }

      if (errors.length > 0) {
        const errorMessage = errors.join('\n');
        this.openModal('Oops...', errorMessage, 'danger', false);
      } else {
        this.openModal('¡Completado!', 'Cambio de estado exitoso', 'success', false);
      }
      this.clear();
    } catch (error) {
      console.log(error);
    }
  }

  async eliminar() {
    if (this.idsEstudianteCursoParalelo.length !== 0) {
      const errors: string[] = [];
      try {
        for (const element of this.idsEstudianteCursoParalelo) {
          const response = await lastValueFrom(this.service.delete(element.id));
          if (!response.response) {
            errors.push(`Error en la eliminación de ${element.name}: ${response.message}`);
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
            this.desactivar();
          } else if (this.action === 'eliminar') {
            this.eliminar();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(value: any) {
    if (!value.response) {
      this.openModal('Oops...', value.message, 'danger', false);
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
    this.loadEstudianteParalelo();
    // this.router.navigate(['../'], { relativeTo: this.route });
  }

}
