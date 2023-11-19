import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { faEdit, faEye, faToggleOff, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTypeaheadModule, NgbPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss']
})

export class NgTableComponent {

  @Input() data: any[] = [];
  @Input() headers: any[] = [];
  @Input() campos: any[] = [];

  @Input() botonera: boolean = true;
  @Input() botonEdit: boolean = true;
  @Input() botonDelete: boolean = true;
  @Input() botonEstado: boolean = true;
  @Input() botonVer: boolean = false;
  @Input() checks: boolean = true;
  @Input() checksOptions: boolean = true;
  @Input() checkDelete: boolean = true;
  @Input() checkDesactive: boolean = true;
  @Input() pageSize = 4;
  @Input() tableName = "default";

  @Output() eliminarAction = new EventEmitter<any>();
  @Output() checkedAction = new EventEmitter<any>();
  @Output() filaAction = new EventEmitter<any>();

  filter = new FormControl('', { nonNullable: true });

  page = 1;
  isCheckedAll = false;
  icon = faToggleOff;
  icon2 = faTrash;
  icon3 = faEye;


  get dataAux(): any[] {
    const filterValue = this.filter.value.toString().toLowerCase();
    return this.data.filter(objeto =>
      Object.entries(objeto).some(([key, value]: [string, any]) =>
        key !== 'id' && value.toString().toLowerCase().includes(filterValue)
      )
    );
  }

  actionChecked(action: any) {
    let checkedData = this.dataAux.filter(item => item.isChecked === true);
    let checkedIds = checkedData.map(item => item[this.campos[0]]);
    let response = { action, data: checkedIds };
    this.checkedAction.emit(response); // Emitir el evento con el objeto data
  }

  actionCheckRow(item: any) {
    //const estado = event.target.checked;
    item.isChecked = !item.isChecked;

    let checkedData = this.dataAux.filter(item => item.isChecked === true);
    if (checkedData.length === this.dataAux.length) {
      this.isCheckedAll = true;
    } else {
      this.isCheckedAll = false;
    }

    if (!this.checksOptions) {
      this.actionChecked('checks')
    }
  }

  actionOnRow(id: string, option: any) {
    this.filaAction.emit({ id, option })
  }

  toggleAll(event: any) {
    const estado = event.target.checked;
    // Calcular el índice de inicio y fin en base a la página actual y el tamaño de la página
    const ini = (this.page - 1) * this.pageSize;
    const end = Math.min(this.page * this.pageSize - 1, this.dataAux.length - 1);
    // Iterar sobre el rango y actualizar isChecked
    for (let i = ini; i <= end; i++) {
      this.dataAux[i].isChecked = estado;
    }
    if (!this.checksOptions) {
      this.actionChecked('checks')
    }
  }

  isChecked() {
    return this.dataAux.some(item => item.isChecked)
  }

  onPageChange(event: any) {
    if (this.isCheckedAll) {
      this.isCheckedAll = !this.isCheckedAll;
    }
  }

  clear() {
    this.filter.setValue('');
  }
}
