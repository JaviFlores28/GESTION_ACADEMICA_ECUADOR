import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { DetalleUsuarioProfesor } from 'src/app/modelos/interfaces/DetalleUsuarioProfesor.interface';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss']
})
export class ProfesoresComponent {
  data: DetalleUsuarioProfesor[] = [];
  headers: string[] = [];
  icon = [
    { icono: 'fa-edit', routerLink: 'editar', id: true ,ruta:true },
    { icono: 'fa-eliminar', click:'', id: true ,ruta:false }

  ]; 
  routerLink:string='nuevo';
  title:string='Profesores';
  itemsDelete:any[]=[];
  constructor(//private docenteService: DocentesService, 
    private modalService: NgbModal) {
  }

  ngOnInit() {
   /* this.docenteService.getTable().subscribe(data => {
      this.data = data.data;
      this.headers = data.headers;
    });*/
  }

  capturarCheck (event:any){    
    this.itemsDelete = event
    console.log(this.itemsDelete);  
  }

  
  eliminarItems(){
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance.contenido = 'Estas seguro eliminar ' +this.itemsDelete.length + ' profesores?';

    modalRef.result.then((result) => {
      if (result === 'save') {
        //this.authService.logout();
        // Redirigir al usuario al login
        //this.router.navigate(['/login']); // Ajusta la ruta según tu configuración
        // O recargar la página
        //window.location.reload();
        console.log(result);
      }
    }).catch((error) => {
      // Lógica para manejar el cierre inesperado del modal
    });
  }

}
