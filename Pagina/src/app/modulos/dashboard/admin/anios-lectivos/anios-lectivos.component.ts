import { Component, OnInit } from '@angular/core';
import { AnioLectivo } from 'src/app/modelos/interfaces/AnioLectivo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';

@Component({
  selector: 'app-anios-lectivos',
  templateUrl: './anios-lectivos.component.html',
  styleUrls: ['./anios-lectivos.component.scss']
})
export class AniosLectivosComponent implements OnInit {

  routerLink: string = 'nuevo';
  title: string = 'Años lectivos';
  data: AnioLectivo[] = [];

  constructor(private service: AnioLectivoService) {
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

