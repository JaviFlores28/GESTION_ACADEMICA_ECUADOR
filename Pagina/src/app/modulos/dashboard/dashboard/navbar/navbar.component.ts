import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faExclamationTriangle, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private ngBootstrap: NgbModal, private servicio: UsuarioService, private router: Router) { }

  @Input() collapsed = true;
  @Input() screenWidth = 0;
  nombre: string = '';
  userid: string = '';
  icon = faUser

  ngOnInit(): void {
    this.getuserInfo()
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
    this.userid = usuario?.USR_ID || '';
  }



  openModal() {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance.contenido = '¿Desea cerrar sesión?';
    // modalRef.componentInstance.icon = faExclamationTriangle;
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.servicio.removeLocal();
        // Redirigir al usuario al login
        this.router.navigate(['login']); // Ajusta la ruta según tu configuración
        // O recargar la página
        //window.location.reload();
      }
    }).catch((error) => {
      // Lógica para manejar el cierre inesperado del modal
    });
  }
}
