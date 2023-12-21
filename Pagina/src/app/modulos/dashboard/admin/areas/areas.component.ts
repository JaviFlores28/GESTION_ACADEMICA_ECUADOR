import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Area } from 'src/app/interfaces/Area.interface';
import { AreaService } from 'src/app/servicios/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
})
export class AreasComponent implements OnInit {
  constructor(
    private service: AreaService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  routerLink: string = 'nuevo';
  titulo: string = 'Áreas';

  data: Area[] = [];
  headers = ['NOMBRE', 'ESTADO'];
  campos = ['AREA_ID', 'AREA_NOM'];

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
