import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/interfaces/Asignatura.interface';
import { AsignaturaService } from 'src/app/servicios/asignatura.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.scss'],
})
export class AsignaturasComponent {
  constructor(
    private service: AsignaturaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  routerLink: string = 'nuevo';
  title: string = 'Asignaturas';

  data: Asignatura[] = [];
  headers = ['NOMBRE', 'TIPO', 'ESTADO'];
  campos = ['ASG_ID', 'ASG_NOM', 'ASG_TIPO'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get().subscribe({
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
