import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/modelos/interfaces/Area.interface';
import { AreaService } from 'src/app/servicios/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
})
export class AreasComponent implements OnInit {

  routerLink: string = 'nuevo';
  title: string = 'Áreas';

  data: Area[] = [];
  headers = ['NOMBRE', 'ESTADO'];

  constructor(private service: AreaService) {
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
}

