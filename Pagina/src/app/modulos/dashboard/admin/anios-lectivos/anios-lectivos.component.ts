import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';

@Component({
  selector: 'app-anios-lectivos',
  templateUrl: './anios-lectivos.component.html',
  styleUrls: ['./anios-lectivos.component.scss'],
})
export class AniosLectivosComponent implements OnInit {
  constructor(
    private service: AnioLectivoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  routerLink: string = 'nuevo';
  titulo: string = 'Años lectivos';
  data: AnioLectivo[] = [];
  headers = ['NOMBRE', 'FECHA INICIO', 'FECHA FIN', 'PERIODOS', 'EXAMENES', 'ESTADO'];
  campos = ['AL_ID', 'AL_NOM', 'AL_INICIO', 'AL_FIN', 'NUM_PRD', 'NUM_EXAM'];

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
    if (data.option === 'ver') {
      this.router.navigate(['../editar/' + data.id], { relativeTo: this.route });
    } else if (data.option === 'eliminar') {
      console.log(data.id);
    }
  }
}
