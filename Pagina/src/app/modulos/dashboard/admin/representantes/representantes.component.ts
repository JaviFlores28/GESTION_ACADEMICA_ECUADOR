import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/modelos/interfaces/Usuario.interface';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.scss']
})
export class RepresentantesComponent {
  constructor(private service: UsuarioService, private router: Router, private route: ActivatedRoute) {}

  routerLink:string='nuevo';
  title:string='Representantes';
  data: Usuario[] = [];
  headers = ['CÉDULA','NOMBRES','CELULAR','CORREO', 'ESTADO'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get('R').subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.data = response.data;
        }
        else {
          console.log(response.message);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
      }
    });
  }

  eliminar(id: any) {
    console.log(id);

  }

  checkedsAction(data: any) {
    console.log(data);
  }

  filaAction(data: any) {
    if (data.option === 'editar') {
      this.router.navigate(['editar/' + data.id], { relativeTo: this.route });
    } else if (data.option === 'eliminar') {
      console.log(data.id);
    }
  }
}
