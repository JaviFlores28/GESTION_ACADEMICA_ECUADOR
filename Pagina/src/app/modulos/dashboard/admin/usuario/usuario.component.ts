import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Usuario } from 'src/app/modelos/interfaces/Usuario.interface';
import { getFormattedDate, variables } from 'src/app/modelos/variables/variables';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {

  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: UsuarioService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  form = this.formBuilder.group({
    USR_DNI: ['', Validators.required],
    USR_NOM: ['', Validators.required],
    USR_NOM2: ['', Validators.required],
    USR_APE: ['', Validators.required],
    USR_APE2: ['', Validators.required],
    USR_DIR: ['', Validators.required],
    USR_TEL: ['', Validators.required],
    USR_CEL: ['', Validators.required],
    USR_EMAIL: ['', Validators.required],
    USR_FECH_NAC: [getFormattedDate(new Date()), Validators.required],
    USR_GEN: ['', Validators.required],
    USUARIO: ['', Validators.required],
    ESTADO: [true, Validators.required],
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
    this.form.get('USUARIO')?.disable();
    if (this.form.valid) {
      console.log('aqui');
      let userid = localStorage.getItem(variables.KEY_NAME);
      if (userid) {
        userid = JSON.parse(atob(userid));
        const usuario: Usuario = {
          USR_ID: '0',
          USR_DNI: this.form.value.USR_DNI || '',
          USR_NOM: this.form.value.USR_NOM || '',
          USR_NOM2: this.form.value.USR_NOM2 || '',
          USR_APE: this.form.value.USR_APE || '',
          USR_APE2: this.form.value.USR_APE2 || '',
          USR_DIR: this.form.value.USR_DIR || '',
          USR_TEL: this.form.value.USR_TEL || '',
          USR_CEL: this.form.value.USR_CEL || '',
          USR_EMAIL: this.form.value.USR_EMAIL || '',
          USR_FECH_NAC: this.form.value.USR_FECH_NAC ? new Date(this.form.value.USR_FECH_NAC) : new Date(),
          USR_GEN: this.form.value.USR_GEN || '',
          USUARIO: 'NO USER',
          ROL_PRF: false,
          ROL_REPR: false,
          ROL_ADMIN: true,
          ESTADO: this.form.value.ESTADO || false,
          USR_PSWD: 'NO PSWD'
        };
        this.service.post(usuario).subscribe(
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
      const usuario: Usuario = {
        USR_ID: this.elementoId,
        USR_DNI: this.form.value.USR_DNI || '',
        USR_NOM: this.form.value.USR_NOM || '',
        USR_NOM2: this.form.value.USR_NOM2 || '',
        USR_APE: this.form.value.USR_APE || '',
        USR_APE2: this.form.value.USR_APE2 || '',
        USR_DIR: this.form.value.USR_DIR || '',
        USR_TEL: this.form.value.USR_TEL || '',
        USR_CEL: this.form.value.USR_CEL || '',
        USR_EMAIL: this.form.value.USR_EMAIL || '',
        USR_FECH_NAC: (this.form.value.USR_FECH_NAC) ? new Date(this.form.value.USR_FECH_NAC) : new Date(),
        USR_GEN: this.form.value.USR_GEN || '',
        USUARIO: 'NO USER',
        ROL_PRF: false,
        ROL_REPR: false,
        ROL_ADMIN: true,
        ESTADO: this.form.value.ESTADO || false,
        USR_PSWD: 'NO PSWD'
      };

      this.service.put(usuario).subscribe(
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

  llenarForm(data: Usuario) {
    console.log(data);
    
    this.form.get('USR_DNI')?.setValue(data.USR_DNI);
    this.form.get('USR_NOM')?.setValue(data.USR_NOM);
    this.form.get('USR_NOM2')?.setValue(data.USR_NOM2);
    this.form.get('USR_APE')?.setValue(data.USR_APE);
    this.form.get('USR_APE2')?.setValue(data.USR_APE2);
    this.form.get('USR_DIR')?.setValue(data.USR_DIR);
    this.form.get('USR_TEL')?.setValue(data.USR_TEL);
    this.form.get('USR_CEL')?.setValue(data.USR_CEL);
    this.form.get('USR_EMAIL')?.setValue(data.USR_EMAIL);
    this.form.get('USR_FECH_NAC')?.setValue(getFormattedDate(data.USR_FECH_NAC));
    this.form.get('USR_GEN')?.setValue(data.USR_GEN);
    this.form.get('USUARIO')?.setValue(data.USUARIO);
    this.form.get('ESTADO')?.setValue((data.ESTADO===0)?false:true); // Asumiendo que 'estado' es un control en tu formulario

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