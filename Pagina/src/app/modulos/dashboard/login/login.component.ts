import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UsuarioLogin } from 'src/app/sistema/interfaces/usuario-Login.interface';
import { ModalService } from 'src/app/servicios/modal.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: AutentificacionService,
    private renderer: Renderer2,
    private el: ElementRef,
    private modalService: ModalService,
  ) { }

  icon = faUserTie;
  HAS_2FA = false;

  formulario = this.formBuilder.group({
    usuario: ['administrador', [Validators.required, Validators.minLength(8)]],
    pswd: ['admin', Validators.required],
  });

  formulario2AF = this.formBuilder.group({
    TOKEN: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.addStyle();
  }

  get usuario() {
    return this.formulario.get('usuario');
  }
  get pswd() {
    return this.formulario.get('pswd');
  }

  login() {
    if (this.formulario.valid) {
      const usuario: UsuarioLogin = {
        USUARIO: this.formulario.value.usuario || '', // Si es null o undefined, se asigna una cadena vacía.
        USR_PSWD: this.formulario.value.pswd || '', // Igual aquí para pswd
      };
      this.service.login(usuario).subscribe({
        next: (value) => {
          if (!value.response) {
            this.openAlertModal('Error', value.message, 'danger', false);
          } else {
            if (!value.data.AUTHENTICATED) {
              this.HAS_2FA = true;
            } else {
              this.resetStyle();
              this.service.setUserIdLocal(value.data.USER_ID);
              this.router.navigate(['']);

            }
          }
        },
        error: (error) => {
          this.openAlertModal('Error', error, 'danger', false);
          console.error(error);
        },
      });
      this.formulario.reset();
    } else {
      this.formulario.markAllAsTouched();
    }
  }


  validar2FA() {
    if (this.formulario2AF.valid) {
      const TOKEN = this.formulario2AF.value.TOKEN || '';
      this.service.authentificated(TOKEN).subscribe({
        next: (value) => {
          if (!value.response) {
            this.openAlertModal('Error', value.message, 'danger', false);
          } else {
            this.resetStyle();
            this.service.setUserIdLocal(value.data.USER_ID);
            this.router.navigate(['']);
          }
        },
        error: (error) => {
          this.openAlertModal('Error', error, 'danger', false);
          console.error(error);
        },
      });
    }
  }

  addStyle() {
    const htmlElement = this.el.nativeElement.ownerDocument.documentElement;
    const bodyElement = this.el.nativeElement.ownerDocument.body;
    const appRootElement = this.el.nativeElement.ownerDocument.querySelector('app-root');
    this.renderer.setStyle(htmlElement, 'height', '100%');
    this.renderer.setStyle(bodyElement, 'height', '100%');
    this.renderer.setStyle(appRootElement, 'height', '100%');
    this.renderer.setStyle(appRootElement, 'display', 'flex');
    this.renderer.setStyle(appRootElement, 'flex-wrap', 'wrap');
    this.renderer.setStyle(appRootElement, 'align-content', 'center');
    this.renderer.setStyle(appRootElement, 'justify-content', 'center');
  }

  resetStyle() {
    const htmlElement = this.el.nativeElement.ownerDocument.documentElement;
    const bodyElement = this.el.nativeElement.ownerDocument.body;
    const appRootElement = this.el.nativeElement.ownerDocument.querySelector('app-root');
    this.renderer.removeStyle(htmlElement, 'height');
    this.renderer.removeStyle(bodyElement, 'height');
    this.renderer.removeStyle(appRootElement, 'height');
    this.renderer.removeStyle(appRootElement, 'display');
    this.renderer.removeStyle(appRootElement, 'flex-wrap');
    this.renderer.removeStyle(appRootElement, 'align-content');
    this.renderer.removeStyle(appRootElement, 'justify-content');
  }

  openAlertModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form);
  }
}
