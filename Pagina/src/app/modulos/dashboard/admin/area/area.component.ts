import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Area } from 'src/app/modelos/interfaces/Area.interface';
import { variables } from 'src/app/modelos/variables/variables';
import { AreaService } from 'src/app/servicios/area.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  modoEdicion: boolean = false;
  elementoId: string = '';

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    estado: [true]
  });

  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: AreaService) {
  }

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
        const area: Area = {
          AREA_ID: '0',
          AREA_NOM: this.form.value.nom || '',
          ESTADO: (this.form.value.estado) ? '1' : '2',
          CREADOR_ID: userid || ''
        };
        this.service.post(area).subscribe(
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
      const area: Area = {
        AREA_ID: this.elementoId,
        AREA_NOM: this.form.value.nom || '',
        ESTADO: (this.form.value.estado) ? '1' : '2',
        CREADOR_ID: '1'
      };
      this.service.put(area).subscribe(
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

  llenarForm(data: Area) {
    const estado = (data.ESTADO === 'Activo') ? true : false;
    this.form.get('estado')?.setValue(estado); // Asumiendo que 'estado' es un control en tu formulario
    this.form.get('nom')?.setValue(data.AREA_NOM); // Asumiendo que 'nom' es un control en tu formulario
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
