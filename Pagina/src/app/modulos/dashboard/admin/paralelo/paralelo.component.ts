import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { AnioLectivo } from 'src/app/modelos/interfaces/AnioLectivo.interface';
import { Curso } from 'src/app/modelos/interfaces/Curso.interface';
import { Paralelo } from 'src/app/modelos/interfaces/Paralelo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss']
})
export class ParaleloComponent implements OnInit {


  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: ParaleloService, private serviceCursos: CursoService, private serviceAnios: AnioLectivoService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;
  anios: AnioLectivo[] = [];
  cursos: Curso[] = [];

  form = this.formBuilder.group({
    PRLL_NOM: ['', Validators.required],
    CRS_ID: ['', Validators.required],
    AL_ID: ['', Validators.required],
    ESTADO: [false, Validators.required]
  })

  ngOnInit(): void {
    this.validarEdicion();
    this.loadCursos()
    this.loadanios()
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
      const paralelo: Paralelo = this.buildObject();
      this.service.post(paralelo).subscribe(
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
      const paralelo: Paralelo = this.buildObjectEdit();

      this.service.put(paralelo).subscribe(
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
        this.router.navigate(['../editar/' + response.data], { relativeTo: this.route });
      }

    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

  buildObject() {
    const userId = this.serviceUsuario.getUserLoggedId();
    const paralelo: Paralelo = {
      PRLL_ID: '0',
      PRLL_NOM: this.form.value.PRLL_NOM || '',
      CRS_ID: this.form.value.CRS_ID || '',
      AL_ID: this.form.value.AL_ID || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      CREADOR_ID: userId || ''

    };
    return paralelo;
  }

  buildObjectEdit() {
    const paralelo: Paralelo = {
      PRLL_ID: this.elementoId,
      PRLL_NOM: this.form.value.PRLL_NOM || '',
      CRS_ID: this.form.value.CRS_ID || '',
      AL_ID: this.form.value.AL_ID || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      CREADOR_ID: '0'
    };
    return paralelo;
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

  loadCursos() {
    this.serviceCursos.getEnabled().subscribe({
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

  loadanios() {
    this.serviceAnios.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.anios = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadForm(data: Paralelo) {
    this.form.get('PRLL_NOM')?.setValue(data.PRLL_NOM);
      this.form.get('CRS_ID')?.setValue(data.CRS_ID);
      this.form.get('AL_ID')?.setValue(data.AL_ID);
      this.form.get('ESTADO')?.setValue(data.ESTADO === 1)
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
