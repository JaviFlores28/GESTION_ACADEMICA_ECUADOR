import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteService } from 'src/app/servicios/estudiante.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent {
  routerLink:string='nuevo';
  title:string='Estudiantes';
  
  data: Estudiante[] = [];
  headers = ['CÉDULA','NOMBRES','PROVINCIA','CANTÓN', 'ESTADO'];
  campos = ['EST_ID','EST_DNI','EST_NOM','EST_PRV','EST_CAN'];

  constructor(private service: EstudianteService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.get().subscribe({
      next: value => {
        if (value.response) {
          this.data = value.data;
        }
        else {
          console.log(value.message);
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
