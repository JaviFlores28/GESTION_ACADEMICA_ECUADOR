import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/modelos/interfaces/Area.interface';
import { AreaService } from 'src/app/servicios/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit{

  routerLink:string='nuevo';
  title:string='Áreas';

  data: Area[] = [];

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
          console.log(this.data);
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

}

