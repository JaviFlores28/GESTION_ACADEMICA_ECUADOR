import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faIdBadge, faInfoCircle, faKey, faPersonChalkboard, faUser } from '@fortawesome/free-solid-svg-icons';
import { UsuarioProfesor } from 'src/app/interfaces/UsuarioProfesor.interface';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { getFormattedDate } from 'src/app/sistema/variables/variables';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UsuarioProfesorService } from 'src/app/servicios/usuario-profesor.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { MyValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: UsuarioService,
    private detalleService: UsuarioProfesorService,
    private modalService: ModalService,
    private authService: AutentificacionService
  ) { }

  modoEdicion: boolean = false;
  rutaActual: string[] = [];
  routerLink: string = '../';
  titulo: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?'; elementoId: string = '';
  icon = faInfoCircle;
  fauser = faUser;
  fakey = faKey;
  faperson = faPersonChalkboard;
  fa2fa = faIdBadge;
  isRep = false;
  isAdmin = false;
  isProf = false;
  isMyInfo = false;
  QR = '';

  form = this.formBuilder.group({
    USR_DNI: ['', MyValidators.required, MyValidators.validateCedula],
    USR_NOM: ['', MyValidators.required,MyValidators.soloLetras],
    USR_NOM2: ['', MyValidators.required,MyValidators.soloLetras],
    USR_APE: ['', MyValidators.required,MyValidators.soloLetras],
    USR_APE2: ['', MyValidators.required,MyValidators.soloLetras],
    USR_DIR: ['', MyValidators.required],
    USR_TEL: ['', MyValidators.required],
    USR_CEL: ['', MyValidators.required,MyValidators.validateCelular],
    USR_EMAIL: ['', MyValidators.required, MyValidators.validarCorreo],
    USR_FECH_NAC: [getFormattedDate(new Date()), MyValidators.required],
    USR_GEN: ['', MyValidators.required],
    USUARIO: [{ value: '', disabled: true }, MyValidators.required],
    ESTADO: [true],
    PRF_FECH_INGR_INST: [getFormattedDate(new Date())],
    PRF_FECH_INGR_MAG: [getFormattedDate(new Date())],
  });

  formPswd = this.formBuilder.group({
    USR_PSWD_NEW: ['', Validators.required],
    USR_PSWD: ['', Validators.required],
  });

  form2FA = this.formBuilder.group({
    HAS_2FA: [false],
    TOKEN: ['']
  }
  )

  ngOnInit(): void {
    this.validarEdicion();
  }


  validarEdicion() {
    this.rutaActual = this.router.url.split('/');
    this.route.paramMap.subscribe((params) => {
      const id = this.getIdFromParams(params);
      this.determinarRolDesdeRuta();
      if (id) {
        this.setupEdicion(id);
      } else {
        this.setupNuevo();
      }
    });
  }

  private getIdFromParams(params: ParamMap): string {
    return this.rutaActual[2] === 'myinfo' ? this.authService.getUserIdLocal() : params.get('id');
  }

  determinarRolDesdeRuta() {
    this.titulo = this.rutaActual[2].charAt(0).toUpperCase() + this.rutaActual[2].slice(1);
    const rol = this.rutaActual[2];
    this.isAdmin = rol === 'administradores';
    this.isRep = rol === 'representantes';
    this.isProf = rol === 'profesores';
    this.isMyInfo = this.rutaActual[2] === 'myinfo';
    this.routerLink += this.isProf ? 'all' : '';
  }


  private setupEdicion(id: string): void {
    this.modoEdicion = true;
    this.elementoId = id;
    this.modaltitle = 'Editar';
    this.modalMsg = '¿Desea editar el registro?';
    this.routerLink = this.isProf ? '../../all' : '../../';
    this.loadDataEdit();
  }

  private setupNuevo(): void {
    this.modoEdicion = false;
    this.elementoId = '';
  }


  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  onSubmitPswd() {
    if (this.form.valid) {
      const pswd = { id: this.elementoId, pswdNew: this.formPswd.value.USR_PSWD_NEW, pswdOld: this.formPswd.value.USR_PSWD };
      this.service.updatePswd(pswd).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  disable2FA(){
    this.authService.disable2FA().subscribe({
      next: (value) => {
        if (value.response) {
          this.handleResponse(value);
        } else {
          this.handleErrorResponse(value.message)
        }
      },
      error: (err) => {
        this.handleErrorResponse(err)
      },
    })
  }
  enable2FA() {
    const token = this.form2FA.value.TOKEN || ''
    this.authService.enable2FA(token).subscribe({
      next: (value) => {
        if (value.response) {
          this.handleResponse(value);
        } else {
          this.handleErrorResponse(value.message)
        }
      },
      error: (err) => {
        this.handleErrorResponse(err)
      },
    })
  }

  crear() {
    if (this.form.valid) {
      const usuario: Usuario = this.buildObject();
      const detalle = this.isProf ? this.buildUsuarioProfesorObject() : undefined;
      this.service.post(usuario, detalle).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  editar() {
    if (this.form.valid) {
      const usuario: Usuario = this.buildObjectEdit();
      this.service.put(usuario).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
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
      USR_FECH_NAC: this.form.value.USR_FECH_NAC ? new Date(this.form.value.USR_FECH_NAC) : new Date(),
      USR_GEN: this.form.value.USR_GEN || '',
      USUARIO: 'NO USER',
      ROL_PRF: this.isProf ? 1 : 0,
      ROL_REPR: this.isRep ? 1 : 0,
      ROL_ADMIN: this.isAdmin ? 1 : 0,
      ESTADO: this.form.value.ESTADO ? 1 : 0,
      USR_PSWD: 'NO PSWD',
      FA_KEY: '',
      HAS_2FA: this.form2FA.value.HAS_2FA ? 1 : 0
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
      ROL_PRF: this.isProf ? 1 : 0,
      ROL_REPR: this.isRep ? 1 : 0,
      ROL_ADMIN: this.isAdmin ? 1 : 0,
      ESTADO: this.form.value.ESTADO ? 1 : 0,
      USR_PSWD: 'NO PSWD',
      FA_KEY: '',
      HAS_2FA: 0
    };
    return usuario;
  }

  buildUsuarioProfesorObject() {
    const detalle: UsuarioProfesor = {
      USR_ID: '0',
      PRF_FECH_INGR_INST: this.form.value.PRF_FECH_INGR_INST ? new Date(this.form.value.PRF_FECH_INGR_INST) : new Date(),
      PRF_FECH_INGR_MAG: this.form.value.PRF_FECH_INGR_MAG ? new Date(this.form.value.PRF_FECH_INGR_MAG) : new Date(),
    };
    return detalle;
  }

  loadDataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.llenarForm(value.data);
          if (this.isProf) {
            this.loadDetalle();
          }
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadDetalle() {
    this.detalleService.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.llenarFormDetalle(value.data);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarForm(data: Usuario) {
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
    this.form.get('ESTADO')?.setValue(data.ESTADO !== 0);
    this.isAdmin = data.ROL_ADMIN !== 0;
    this.isProf = data.ROL_PRF !== 0;
    this.isRep = data.ROL_REPR !== 0;
    this.form2FA.get('HAS_2FA')?.setValue(data.HAS_2FA !== 0);
  }

  llenarFormDetalle(data: any) {
    this.form.get('PRF_FECH_INGR_INST')?.setValue(getFormattedDate(data.PRF_FECH_INGR_INST));
    this.form.get('PRF_FECH_INGR_MAG')?.setValue(getFormattedDate(data.PRF_FECH_INGR_MAG));
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.modoEdicion) {
            this.editar();
          } else {
            this.crear();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(value: any) {
    if (!value.response) {
      //'Ha ocurrido un error intente nuevamente.'
      this.openModal('Oops...', value.message, 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
        this.loadDataEdit();
        this.form.get('USUARIO')?.disable();
      } else {
        this.openModal('¡Completado!', value.message, 'success', false);
        this.clear();
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    this.form.reset();
    location.reload();
  }

}
