import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Area } from 'src/app/interfaces/Area.interface';
import { Asignatura } from 'src/app/interfaces/Asignatura.interface';
import { Curso } from 'src/app/interfaces/Curso.interface';

import { AreaService } from 'src/app/servicios/area.service';
import { AsignaturaService } from 'src/app/servicios/asignatura.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.scss']
})
export class AsignaturaComponent {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: AsignaturaService, private serviceArea: AreaService, private serviceCursos: CursoService, private serviceUsuario: UsuarioService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  areas: Area[] = [];
  cursos: Curso[] = [];
  icon = faInfoCircle;
  userid = this.serviceUsuario.getUserLoggedId();

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    cltv: [false, Validators.required],
    area: ['', Validators.required],
    estado: [true, Validators.required]
  });


  ngOnInit(): void {
    this.validarEdicion();
    this.loadAreas();
  }

  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadDataEdit();
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
      if (this.userid !== '') {
        const asignatura: Asignatura = {
          ASG_ID: '1',
          ASG_NOM: this.form.value.nom || '',
          ASG_TIPO: (this.form.value.cltv) ? '1' : '2',
          AREA_ID: this.form.value.area || '',
          ESTADO: (this.form.value.estado) ? 1 : 0,
          CREADOR_ID: this.userid || ''
        };
        this.service.post(asignatura).subscribe(
          {
            next: (response) => {
              if (!response.data) {
                this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
                console.log(response.message);
              } else {
                this.openAlertModal(response.message, 'success')
                console.log(response.message);
                this.form.reset();
                this.router.navigate(['../'], { relativeTo: this.route });
              }
            },
            error: (error) => {
              this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
              console.log(error);;
            }
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  editar() {
    if (this.form.valid) {
      const asignatura: Asignatura = {
        ASG_ID: this.elementoId,
        ASG_NOM: this.form.value.nom || '',
        ASG_TIPO: (this.form.value.cltv) ? '1' : '2',
        AREA_ID: this.form.value.area || '',
        ESTADO: (this.form.value.estado) ? 1 : 0,
        CREADOR_ID: this.userid
      };
      this.service.put(asignatura).subscribe(
        {
          next: (response) => {
            if (!response.data) {
              this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
              console.log(response.message);
            } else {
              this.openAlertModal(response.message, 'success')
              console.log(response.message);
            }

          },
          error: (errordata) => {
            this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
            console.log(errordata);
          }
        }
      );
      // this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  loadDataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadAreas() {
    this.serviceArea.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.areas = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  llenarForm(data: Asignatura) {
    this.form.get('nom')?.setValue(data.ASG_NOM); // Asumiendo que 'nom' es un control en tu formulario
    this.form.get('cltv')?.setValue(data.ASG_TIPO === 'CUALITATIVA'); // Asumiendo que 'nom' es un control en tu formulario
    this.form.get('area')?.setValue(data.AREA_ID); // Asumiendo que 'nom' es un control en tu formulario
    this.form.get('estado')?.setValue(data.ESTADO === 1); // Asumiendo que 'estado' es un control en tu formulario
    this.userid = data.CREADOR_ID;
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
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar la asignatura?' : '¿Desea editar la asignatura?');
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
