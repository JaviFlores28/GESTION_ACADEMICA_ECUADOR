import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private servicio: UsuarioService,
    private router: Router,
    private modalService: ModalService,
  ) {}

  @Input() collapsed = true;
  @Input() screenWidth = 0;
  nombre: string = '';
  USR_ID: string = '';
  icon = faUser;
  msg: string = '¿Desea cerrar sesión?';

  ngOnInit(): void {
    this.getuserInfo();
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  async getuserInfo() {
    let usuario = await this.servicio.getUserLogged();
    this.nombre = usuario?.USR_NOM || '' + usuario?.USR_APE;
    this.USR_ID = usuario?.USR_ID || '';
  }

  openModal() {
    this.modalService
      .openConfirmationModal(this.msg)
      .then((result) => {
        if (result === 'save') {
          this.servicio.removeLocal();
          // Redirigir al usuario al login
         // this.router.navigate(['login']);
          // O recargar la página
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
