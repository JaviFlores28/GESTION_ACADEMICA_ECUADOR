import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UsuarioLogin } from 'src/app/sistema/interfaces/usuario-Login.interface';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: UsuarioService,
    private renderer: Renderer2,
    private el: ElementRef,
    private modalService: ModalService,
  ) { }

  icon = faUserTie;

  formulario = this.formBuilder.group({
    usuario: ['administrador', [Validators.required, Validators.minLength(8)]],
    pswd: ['admin', Validators.required],
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
        usuario: this.formulario.value.usuario || '', // Si es null o undefined, se asigna una cadena vacía.
        pswd: this.formulario.value.pswd || '', // Igual aquí para pswd
      };
      this.service.getByUser(usuario).subscribe({
        next: (value) => {
          if (!value.response) {
            this.openAlertModal('Error', 'Contraseña o usuario incorrecto.', 'danger', false);
          } else {
            this.service.setLocal(value.data);
            this.resetStyle();
            this.router.navigate(['/home']);
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
