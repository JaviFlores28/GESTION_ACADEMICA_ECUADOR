import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';


@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss']
})
export class EstudianteCursoParaleloComponent {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: EstudianteCursoParaleloService, private serviceCurso: CursoService, private serviceEstudiante: EstudianteService) { }

  userId = this.serviceUsuario.getUserLoggedId();
  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;

  estudiantes: Estudiante[] = [];
  idEstudiantesSelecionados: string[] = [];
  cursos: Curso[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idEstudianteCursoParalelosSelecionadas: string[] = [];

  headersNoEstudianteCursoParalelodos = ['DNI', 'NOMBRES'];
  headers = ['CURSO', 'NOMBRES', 'PASE', 'ESTADO'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required]
  })

  ngOnInit(): void {
    this.loadEstudianteCursoParalelos();
    this.loadCursos();
    this.loadEstudiantes();
  }

  loadCursos() {
    this.serviceCurso.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
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

  loadEstudiantes() {
    this.serviceEstudiante.getNoMatriculados().subscribe({
      next: (value) => {
        if (value.data) {
          this.estudiantes = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadEstudianteCursoParalelos() {
    this.service.getEnabled().subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.matriculas = response.data;
        }
        else {
          console.log(response.message);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
      }
    });
  }


  estudiantesaction(result: any) {
    this.idEstudiantesSelecionados = result.data;
  }

  matriculasAction(data: any) {
    let action = data.action;
    this.idEstudianteCursoParalelosSelecionadas = data.data;
    if (action === 'desactivar') {
      this.desactivar();
    } else if (action === 'eliminar') {
      console.log(action);

    }
  }

  onSubmit() {
    this.openConfirmationModal();
  }

  crear() {
    const data = { usuario: this.userId, curso: this.form.value.CRS_ID, estudiantes: this.idEstudiantesSelecionados };
    this.service.post(data).subscribe(
      {
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => this.handleErrorResponse(error)
      }
    );
  }

  desactivar() {
    this.service.put(this.idEstudianteCursoParalelosSelecionadas).subscribe(
      {
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => this.handleErrorResponse(error)
      }
    );
  }

  clear() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleResponse(response: any) {
    if (!response.data) {
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(response.message);
    } else {
      if (this.modoEdicion) {
        this.openAlertModal(response.message, 'success');
        console.log(response.message);
      } else {
        this.openAlertModal(response.message, 'success');
        this.form.reset();
       // this.router.navigate([response.data], { relativeTo: this.route });
      }

    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

  openAlertModal(content: string, alertType: string) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = content);
    modalRef.componentInstance.icon = (alertType == 'success') ? faCircleCheck : (alertType == 'danger') ? faCircleXmark : faInfoCircle;
    modalRef.componentInstance.color = alertType;
    modalRef.componentInstance.modal = false;
  }

  openConfirmationModal() {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });

    // Usa el operador Elvis para asegurarte de que activeModal y contenido estén definidos
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar?' : '¿Desea editar?');
    modalRef.componentInstance.icon = faInfoCircle;
    modalRef.componentInstance.color = 'warning';
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.crear();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

}

/*  editar() {
   if (this.form.valid) {
     const matricula: EstudianteCursoParalelo = this.buildObjectEdit();
 
     this.service.put(matricula).subscribe(
       {
         next: (response) => {
           this.handleResponse(response);
         },
         error: (error) => this.handleErrorResponse(error)
       }
     );
 
   } else {
     this.form.markAllAsTouched();
   }
 } */
/*
  buildObjectEdit() {
    const matricula: EstudianteCursoParalelo = {
      MTR_ID: this.elementoId,
      CRS_ID: this.form.value.CRS_ID || '',
      EST_ID: this.form.value.EST_ID || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      PASE: this.form.value.PASE || '',
      CREADOR_ID: '0'
    };
    return matricula;
  }
 */
/*  loadEditData() {
   this.service.getById(this.elementoId).subscribe({
     next: (value) => {
       if (value.data) {
         this.loadForm(value.data);
       } else {
         console.log(value.message);
       }
     },
     error: (error) => {
       console.log(error);
     }
   });
 } */
/*
  loadForm(data: EstudianteCursoParalelo) {
    const paseMapping: { [key: string]: string } = {
      'Aprobado': '1',
      'Reprobado': '2',
      'Suspenso': '3',
      'En proceso': '4'
    };
 
    const paseValue = paseMapping[data.PASE] || '';
    this.form.get('PASE')?.setValue(paseValue);
 
    this.form.get('CRS_ID')?.setValue(data.CRS_ID);
    this.form.get('EST_ID')?.setValue(data.EST_ID);
    this.form.get('ESTADO')?.setValue(data.ESTADO === 1);
  }
 */


/*  crear() {
   if (this.form.valid) {
     const matricula: EstudianteCursoParalelo = this.buildObject('');
     this.service.post(matricula).subscribe(
       {
         next: (response) => {
           this.handleResponse(response);
         },
         error: (error) => this.handleErrorResponse(error)
       }
     );
   } else {
     this.form.markAllAsTouched();
   }
 } */


/*
  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadEditData();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  } 

*/