import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {

  titulo: string = 'UNIDAD EDUCATIVA FRAY BARTOLOMÉ DE LAS CASAS';
  mision: string = 'Formar estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  vision: string = 'Ser una institución educativa líder en la formación de estudiantes con valores, conocimientos y habilidades para la vida, que contribuyan al desarrollo de la sociedad.';
  isEdit: boolean = true;

  buttonEdit() {
    console.log(this.titulo);
    
  }
}
