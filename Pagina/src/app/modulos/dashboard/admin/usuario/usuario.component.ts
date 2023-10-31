import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle, faKey, faPersonChalkboard, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { DetalleUsuarioProfesor } from 'src/app/modelos/interfaces/DetalleUsuarioProfesor.interface';
import { Usuario } from 'src/app/modelos/interfaces/Usuario.interface';
import { getFormattedDate } from 'src/app/modelos/variables/variables';
import { DetalleUsuarioProfesorService } from 'src/app/servicios/detalle-usuario-profesor.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {

  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: UsuarioService, private serviceDetalle: DetalleUsuarioProfesorService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;
  fauser = faUser;
  fakey = faKey;
  faperson = faPersonChalkboard;
  isRep = false;
  isAdmin = false;
  isProf = false;

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
    USUARIO: [{ value: '', disabled: true }, Validators.required],
    ESTADO: [true, Validators.required],
    PRF_FECH_INGR_INST: [getFormattedDate(new Date()), Validators.required],
    PRF_FECH_INGR_MAG: [getFormattedDate(new Date()), Validators.required]
  })

  formPswd = this.formBuilder.group({
    USR_PSWD_NEW: ['', Validators.required],
    USR_PSWD: ['', Validators.required]
  })

  ngOnInit(): void {
    this.determinarRolDesdeRuta();
    this.validarEdicion();
  }

  determinarRolDesdeRuta() {
    const rutaActual = this.router.url.split('/');
    const rol = rutaActual[2];

    if (rol === 'usuarios') {
      this.isAdmin = true;
    } else if (rol === 'institucion') {
      const subrol = rutaActual[3];
      this.isRep = (subrol === 'representantes');
      this.isProf = (subrol === 'profesores');
    }
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

  onSubmitPswd() {
    if (this.form.valid) {
      //const userId = this.service.getUserLoggedId();

      const pswd = { id: this.elementoId, pswdNew: this.formPswd.value.USR_PSWD_NEW, pswdOld: this.formPswd.value.USR_PSWD};
      this.service.updatePswd(pswd).subscribe(
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

  crear() {
    if (this.form.valid) {
      //const userId = this.service.getUserLoggedId();
      const usuario: Usuario = this.buildObject();
      const detalle = this.isProf ? this.buildDetalleUsuarioProfesorObject() : undefined;

      this.service.post(usuario, detalle).subscribe(
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
      const usuario: Usuario = this.buildObjectEdit();

      this.service.put(usuario).subscribe(
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

  buildObjectEdit() {
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
      ROL_PRF: (this.isProf) ? 1 : 0,
      ROL_REPR: (this.isRep) ? 1 : 0,
      ROL_ADMIN: (this.isAdmin) ? 1 : 0,
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      USR_PSWD: 'NO PSWD'
    };
    return usuario;
  }

  buildObject() {
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
      ROL_PRF: (this.isProf) ? 1 : 0,
      ROL_REPR: (this.isRep) ? 1 : 0,
      ROL_ADMIN: (this.isAdmin) ? 1 : 0,
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      USR_PSWD: 'NO PSWD'
    };
    return usuario;
  }

  buildDetalleUsuarioProfesorObject() {
    const detalle: DetalleUsuarioProfesor = {
      DTLL_PRF_ID: '0',
      PRF_FECH_INGR_INST: this.form.value.PRF_FECH_INGR_INST ? new Date(this.form.value.PRF_FECH_INGR_INST) : new Date(),
      PRF_FECH_INGR_MAG: this.form.value.PRF_FECH_INGR_MAG ? new Date(this.form.value.PRF_FECH_INGR_MAG) : new Date(),
      USR_ID: '0'
    }
    return detalle;
  }

  loadData() {
    this.service.searchById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.loadForm(value.data);
          this.loadDetalle()
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadForm(data: Usuario) {
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
    this.form.get('ESTADO')?.setValue((data.ESTADO === 0) ? false : true); // Asumiendo que 'estado' es un control en tu formulario
    this.isAdmin = (data.ROL_ADMIN === 0) ? false : true;
    this.isProf = (data.ROL_PRF === 0) ? false : true;
    this.isRep = (data.ROL_REPR === 0) ? false : true;
  }

  loadDetalle() {
    this.serviceDetalle.searchById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.loadFormDetalle(value.data)
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadFormDetalle(data: any) {
    this.form.get('PRF_FECH_INGR_INST')?.setValue(getFormattedDate(data.PRF_FECH_INGR_INST));
    this.form.get('PRF_FECH_INGR_MAG')?.setValue(getFormattedDate(data.PRF_FECH_INGR_MAG));
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