import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EscalasReferencialesCalificaciones } from 'src/app/interfaces/EscalasReferencialesCalificaciones.interface';
import { Parametro } from 'src/app/interfaces/Parametro.interface';
import { EscalasReferencialesCalificacionesService } from 'src/app/servicios/escalas-referenciales-calificaciones.service';
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {
  constructor(
    private service: ParametrosService,
    private escalaService: EscalasReferencialesCalificacionesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  data: Parametro[] = [];
  data2: EscalasReferencialesCalificaciones[] = [];

  headers = ['NOMBRE', 'DESCRIPCIÓN'];
  campos = ['PRMT_ID', 'PRMT_NOM', 'PRMT_DESCR'];
  headers2 = ['ABREVIATURA', 'DESCRIPCIÓN', 'INICIAL', 'FINAL']
  campos2 = [`ESCL_ID`, `ESCL_ABRV`, `ESCL_DESCR`, `ESCL_INI`, `ESCL_FIN`];

  ngOnInit(): void {
    this.loadData();
    this.loadData2();
  }

  loadData() {
    this.service.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.data = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  loadData2() {
    this.escalaService.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.data2 = value.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
  filaAction(data: any, tipo: string) {
  console.log(tipo);
  
    if (data.option === 'editar') {
      if (tipo === 'E') {
        this.router.navigate(['editarEscala/' + data.id], { relativeTo: this.route });
      } else {
        this.router.navigate(['editarParametro/' + data.id], { relativeTo: this.route });
      }
    } else if (data.option === 'eliminar') {
      console.log(data.id);
    }
  }

}
