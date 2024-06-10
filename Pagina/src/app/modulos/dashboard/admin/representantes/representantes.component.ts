import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.scss'],
})
export class RepresentantesComponent {
  constructor(
    private service: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,

  ) {}

  routerLink: string = 'nuevo';
  titulo: string = 'Representantes';

  data: Usuario[] = [];
  headers = ['CÉDULA', 'NOMBRES', 'USUARIO', 'CORREO', 'ESTADO'];
  campos = ['USR_ID', 'USR_DNI', 'USR_NOM', 'USUARIO', 'USR_EMAIL'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get('R').subscribe({
      next: (value) => {
        if (value.response) {
          this.data = value.data;
        } else {
          console.error(value.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
      },
    });
  }

  filaAction(data: any) {
    if (data.option === 'editar') {
      this.router.navigate(['editar/' + data.id], { relativeTo: this.route });
    } else if (data.option === 'eliminar') {
      this.delete(data.id)
    }
  }

  async checkedsAction(values: any) {
    if (values.action === 'eliminar' && values.data.length > 0) {
      const errors: string[] = [];
      try {
        for (const element of values.data) {
          const response = await lastValueFrom(this.service.delete(element['id']));
          if (!response.response) {
            errors.push(`Error en la eliminación de ${element['name']}: ${response.message}`);
            break; // Detener en el primer error
          }
        }

        if (errors.length > 0) {
          const errorMessage = errors.join('\n');
          this.openModal('Oops...', errorMessage, 'danger', false);
        } else {
          this.openModal('¡Eliminado!', 'Eliminación exitosa', 'success', false);
        }

        this.loadData();
      } catch (error) {
        console.log(error);
      }
    } else if (values.action === 'desactivar' && values.data.length > 0) {
      const errors: string[] = [];
      try {
        for (const element of values.data) {
          const response = await lastValueFrom(this.service.updateEstado(element['id']));
          if (!response.response) {
            errors.push(`Error en el cambio de estado de ${element['name']}: ${response.message}`);
            break; // Detener en el primer error
          }
        }

        if (errors.length > 0) {
          const errorMessage = errors.join('\n');
          this.openModal('Oops...', errorMessage, 'danger', false);
        } else {
          this.openModal('¡Completado!', 'Cambio de estado exitoso', 'success', false);
        }

        this.loadData();
      } catch (error) {
        console.log(error);
      }
    }
  }

  delete(id: string) {
    this.service.delete(id).subscribe({
      next: (value) => {
        if (!value.response) {
          this.openModal('Oops...', value.message, 'danger', false);
        } else {
          this.openModal('¡Eliminado!', value.message, 'success', false);
        }
        this.loadData()
      },
      error: (error) => {
        this.openModal('Oops...', error, 'danger', false);
      },
    })
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        //  console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
