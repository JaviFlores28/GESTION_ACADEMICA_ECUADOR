import { Component, Input, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
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
    private authService: AutentificacionService,
    private modalService: ModalService,
  ) { }

  @Input() collapsed = true;
  @Input() screenWidth = 0;
  nombre: string = '';
  USR_ID: string = this.authService.getUserIdLocal();
  icon = faUser;
  modalMsg: string = '¿Desea cerrar sesión?';

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

  getuserInfo() {
    this.servicio.getById(this.USR_ID).subscribe({
      next: (value) => {
        if (value.response) {
          this.nombre = value.data.USR_NOM || '' + value.data.USR_APE;
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  openModal() {
    this.modalService.openModal('Cerrar sesión', this.modalMsg, 'warning', true).then((result) => {
      if (result === 'save') {
        this.authService.logout().subscribe({
          next: (value) => {
            if (value.response) {
              this.authService.removeUserIdLocal();
              window.location.reload();
            }
          },
          error(err) {
            console.log(err);
          },
        });
      }
    }).catch((error) => {
        console.log(error);
      });
  }
}
