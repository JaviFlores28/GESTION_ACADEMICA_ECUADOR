import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Paralelo } from 'src/app/modelos/interfaces/Paralelo.interface';
import { ParaleloService } from 'src/app/servicios/paralelo.service';

@Component({
  selector: 'app-paralelos',
  templateUrl: './paralelos.component.html',
  styleUrls: ['./paralelos.component.scss']
})
export class ParalelosComponent {
  constructor(private service: ParaleloService, private router: Router, private route: ActivatedRoute) {}

  routerLink:string='nuevo';
  title:string='Paralelos';
 
  data: Paralelo[] = [];
  headers = ['NOMBRE','CURSO','AÑO LECTIVO', 'ESTADO'];


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
