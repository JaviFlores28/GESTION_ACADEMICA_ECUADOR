import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss']
})
export class AdministradoresComponent {

  constructor(
    private service: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  routerLink: string = 'nuevo';
  titulo: string = 'Administradores';
  data: Usuario[] = [];
  headers = ['CÉDULA', 'NOMBRES', 'USUARIO', 'CORREO', 'ESTADO'];
  campos = ['USR_ID', 'USR_DNI', 'USR_NOM', 'USUARIO', 'USR_EMAIL'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get('A').subscribe({
      next: (value) => {
        if (value.response) {
          this.data = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
      },
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