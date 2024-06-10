import { Component, OnInit } from '@angular/core';
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(private service: ParametrosService) { }
  titulo: string = 'UNIDAD EDUCATIVA FRAY BARTOLOMÉ DE LAS CASAS';
  mision: string = 'Formar estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  vision: string = 'Ser una institución educativa líder en la formación de estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  logo: string = '../../../../assets/escudo.png';
  ngOnInit(): void {
    this.service.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.titulo = value.data[1].PRMT_DESCR
          this.mision = value.data[2].PRMT_DESCR
          this.vision = value.data[3].PRMT_DESCR
         // this.logo=value.data[0].PRMT_URL_IMG
          console.log(value.data);

        }
      },
      error: (err) => {

      },
    })
  }




}
