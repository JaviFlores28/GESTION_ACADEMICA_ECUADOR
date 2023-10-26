import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Curso } from 'src/app/modelos/interfaces/Curso.interface';
import { variables } from 'src/app/modelos/variables/variables';
import { CursoService } from 'src/app/servicios/curso.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss']
})
export class CursoComponent {

  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: CursoService) { }


  modoEdicion: boolean = false;
  elementoId: string = '';

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    tip: ['', Validators.required],
    orden: [1, Validators.required],
    estado: [true, Validators.required]
  })

  ngOnInit(): void {
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
      let userid = localStorage.getItem(variables.KEY_NAME);
      if (userid) {
        userid = JSON.parse(atob(userid));
        const curso: Curso = {
          CRS_ID: '0',
          CRS_NOM: this.form.value.nom || '',
          CRS_TIPO: this.form.value.tip || '',
          CRS_ORDEN: this.form.value.orden || 0,
          ESTADO: (this.form.value.estado) ? '1' : '2',
          CREADOR_ID: userid || ''
        };
        this.service.post(curso).subscribe(
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
      const curso: Curso = {
        CRS_ID:this.elementoId,
        CRS_NOM: this.form.value.nom || '',
        CRS_TIPO: this.form.value.tip || '',
        CRS_ORDEN: this.form.value.orden || 0,
        ESTADO: (this.form.value.estado) ? '1' : '2',
        CREADOR_ID: '1'
      };
      this.service.put(curso).subscribe(
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

  loadData() {
    this.service.searchById(this.elementoId).subscribe({
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

  llenarForm(data: Curso) {
    const estado = (data.ESTADO === 'Activo') ? true : false;
    this.form.get('nom')?.setValue(data.CRS_NOM); // Asumiendo que 'nom' es un control en tu formulario
    this.form.get('tip')?.setValue(data.CRS_TIPO); // Asumiendo que 'estado' es un control en tu formulario
    this.form.get('orden')?.setValue(data.CRS_ORDEN); // Asumiendo que 'nom' es un control en tu formulario
    this.form.get('estado')?.setValue(estado); // Asumiendo que 'estado' es un control en tu formulario
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
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar el área?' : '¿Desea editar el área?');
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
