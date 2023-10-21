import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent {
  @Input() headers: any[] | undefined;
  @Input() data: any[] | undefined;
  @Input() titulo: string = '';
  @Input() icon: any[] | undefined;
  @Output() buttonAction = new EventEmitter<any>();
  @Output() checkBox = new EventEmitter<any>()

  itemsDelete:any[]=[];
  obtenerValores(campo: any): string[] {
    return Object.entries(campo)
      .filter(([key]) => key !== 'id') // Filtrar campos que no sean "id"
      .map(([_, value]) => value as string); // Realizar una verificación de tipo
  }
  buttonRow(id: any, type: any) {
    const response = { id, type }; // Crear el objeto data
    this.buttonAction.emit(response); // Emitir el evento con el objeto data
  }
  buttonCheck(id:any){
    if (!this.buscarItems(id)) {
      this.itemsDelete.push(id);
    }else{
      this.quitarItem(id)
    }
    this.checkBox.emit(this.itemsDelete);
  }
  buscarItems(id:any){
    for (let i = 0; i < this.itemsDelete.length; i++) {
      if (this.itemsDelete[i] == id) {
        return true;
      }
    }
    return false;
  }
  quitarItem(id:any){
    for (let i = 0; i < this.itemsDelete.length; i++) {
      if (this.itemsDelete[i] == id) {
        this.itemsDelete.splice(i,1);
      }
    }
  }
  
}
