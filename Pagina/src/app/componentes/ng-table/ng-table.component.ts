import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faToggleOff, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTypeaheadModule, NgbPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss']
})

export class NgTableComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }

  @Input() data: any[] = [];
  @Input() headers: any[] = [];
  @Output() eliminarAction = new EventEmitter<any>();
  @Output() checkedAction = new EventEmitter<any>();

  filter = new FormControl('', { nonNullable: true });
  private cachedHeaders: string[] | null = null;
  page = 1;
  pageSize = 4;
  isCheckedAll = false;
  icon = faToggleOff;
  icon2 = faTrash;

  get getHeaders(): string[] {
    if (this.cachedHeaders) {
      return this.cachedHeaders;
    }
    if (this.data && this.data.length > 0) {
      this.cachedHeaders = Object.keys(this.data[0]).filter(header =>
        !['id', 'estado'].some(keyword => header.toLowerCase().includes(keyword))
      ); return this.cachedHeaders;
    }
    return [];
  }

  get dataAux(): any[] {
    const filterValue = this.filter.value.toString().toLowerCase();
    return this.data.filter(objeto =>
      Object.values(objeto).some((value: any) =>
        value.toString().toLowerCase().includes(filterValue)
      )
    );
  }

  actionChecked(action: any) {
    let checkedData = this.dataAux.filter(item => item.isChecked === true);
    let checkedIds = checkedData.map(item => item.id);
    let response = { action, data: checkedIds };
    this.checkedAction.emit(response); // Emitir el evento con el objeto data
  }

  seleccionarFila(id: string, option: any) {
    if (option === 'editar') {
      this.router.navigate(['editar/' + id], { relativeTo: this.route });
    } else if (option === 'eliminar') {
      this.eliminarAction.emit(id); // Emitir el evento con el objeto data
    }
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
