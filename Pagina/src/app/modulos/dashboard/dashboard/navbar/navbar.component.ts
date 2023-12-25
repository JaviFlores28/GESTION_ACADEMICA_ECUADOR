import { Component, Input, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private servicio: AutentificacionService,
    private modalService: ModalService,
  ) { }

  @Input() collapsed = true;
  @Input() screenWidth = 0;
  nombre: string = '';
  USR_ID: string = '';
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
    this.servicio.getUser().subscribe({
      next: (value) => {
        if (value.response) {
          this.nombre = value.data.USR_NOM || '' + value.data.USR_APE;
          this.USR_ID = value.data.USR_ID || '';
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  openModal() {
    this.modalService
      .openModal('Cerrar sesión', this.modalMsg, 'warning', true)
      .then((result) => {
        if (result === 'save') {
          this.servicio.removeUserIdLocal();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
