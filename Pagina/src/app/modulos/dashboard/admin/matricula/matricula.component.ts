import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Curso } from 'src/app/modelos/interfaces/Curso.interface';
import { Estudiante } from 'src/app/modelos/interfaces/Estudiante.interface';
import { Matricula } from 'src/app/modelos/interfaces/Matricula.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { MatriculaService } from 'src/app/servicios/matricula.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss']
})
export class MatriculaComponent {


  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: MatriculaService, private serviceCurso: CursoService, private serviceEstudiante: EstudianteService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;
  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];


  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required],
    EST_ID: ['', Validators.required],
    ESTADO: [true, Validators.required],
    PASE: ['', Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos();
    this.loadEstudiantes();
    this.validarEdicion();
  }


  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadData();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openConfirmationModal();
  }

  crear() {
    if (this.form.valid) {
      const matricula: Matricula = this.buildObject();
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
  }


  editar() {
    if (this.form.valid) {
      const matricula: Matricula = this.buildObjectEdit();

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
        this.router.navigate([response.data], { relativeTo: this.route });
      }

    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

  buildObject() {
    const userId = this.serviceUsuario.getUserLoggedId();
    const matricula: Matricula = {
      MTR_ID: '0',
      CRS_ID: this.form.value.CRS_ID || '',
      EST_ID: this.form.value.EST_ID || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      PASE: this.form.value.PASE || '',
      CREADOR_ID: userId || ''

    };
    return matricula;
  }

  buildObjectEdit() {
    const matricula: Matricula = {
      MTR_ID: this.elementoId,
      CRS_ID: this.form.value.CRS_ID || '',
      EST_ID: this.form.value.EST_ID || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      PASE: this.form.value.PASE || '',
      CREADOR_ID: '0'
    };
    return matricula;
  }

  loadData() {
    this.service.searchById(this.elementoId).subscribe({
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
  }

  loadForm(data: Matricula) {
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
    this.serviceEstudiante.getEnabled().subscribe({
      next: (value) => {
        console.log(value);

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


  clear() { }
  changeCurso(data: any) { }

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
        if (this.modoEdicion) {
          this.editar();
        } else {
          this.crear();
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

}
