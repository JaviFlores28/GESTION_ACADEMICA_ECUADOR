import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { CursoService } from 'src/app/servicios/curso.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent {
  routerLink: string = 'nuevo';
  title: string = 'Cursos';


  data: Curso[] = [];
  headers = ['NOMBRE', 'TIPO', 'ORDEN', 'ESTADO'];
  campos = ['CRS_ID', 'CRS_NOM', 'CRS_TIPO', 'CRS_ORDEN'];

  constructor(private service: CursoService, private router: Router, private route: ActivatedRoute) {
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
