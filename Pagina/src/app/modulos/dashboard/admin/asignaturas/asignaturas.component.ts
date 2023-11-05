import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/modelos/interfaces/Asignatura.interface';
import { AsignaturaService } from 'src/app/servicios/asignatura.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.scss']
})
export class AsignaturasComponent {

  routerLink:string='nuevo';
  title:string='Asignaturas';

  
  data: Asignatura[] = [];
  headers = ['NOMBRE','TIPO','ÁREA','CURSO', 'ESTADO'];

  constructor(private service: AsignaturaService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get().subscribe({
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


