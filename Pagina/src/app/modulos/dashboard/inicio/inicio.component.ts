import { Component, OnInit } from '@angular/core';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(private service:AutentificacionService){}
  ngOnInit(): void {
    this.service.isLoggedIn().subscribe({
      next(value) {
          console.log(value);
          
      },
      error(err) {
          console.log(err);
          
      },
    })
  }


  titulo: string = 'UNIDAD EDUCATIVA FRAY BARTOLOMÉ DE LAS CASAS';
  mision: string = 'Formar estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  vision: string = 'Ser una institución educativa líder en la formación de estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  isEdit: boolean = true;

  buttonEdit() {
    console.log(this.titulo);
  }
}
