import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { usuarioLogin } from '../../../modelos/interfaces/usuario-Login.interface';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router, private formBuilder: FormBuilder, private service: UsuarioService, private localStorage: LocalStorageService, private renderer: Renderer2, private el: ElementRef) {
  }

  icon = faUserTie;
  formulario = this.formBuilder.group({
    user: ['administrador', [Validators.required, Validators.minLength(8)]],
    pswd: ['admin', Validators.required]
  })

  ngOnInit(): void {
    this.addStyle();
  }

  get user() { return this.formulario.get('user'); }
  get pswd() { return this.formulario.get('pswd'); }

  login() {
    if (this.formulario.valid) {
      const usuario: usuarioLogin = {
        user: this.formulario.value.user || '', // Si es null o undefined, se asigna una cadena vacía.
        pswd: this.formulario.value.pswd || '' // Igual aquí para pswd
      };
      this.service.validarUsuario(usuario).subscribe(
        {
          next: (response) => {
            if (!response.data) {
              console.log(response.message);
            }
            this.service.login(response)
            this.resetStyle()
            this.router.navigate(['/home']);
          },
          error: (errordata) => {
            console.error(errordata);

          }
        }
      );
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



}
