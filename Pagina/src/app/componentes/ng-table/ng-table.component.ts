import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { faEye, faToggleOff, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime } from 'rxjs/operators';


/**
 * Componente de tabla personalizada para mostrar datos en una interfaz de usuario.
 */
@Component({
  selector: 'app-ng-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTypeaheadModule, NgbPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss']
})
export class NgTableComponent implements OnInit {

  /**
   * Datos que se mostrarán en la tabla.
   * @type {any[]}
   */
  @Input() data: any[] = [];

  /**
   * Encabezados de las columnas de la tabla.
   * @type {any[]}
   */
  @Input() headers: any[] = [];

  /**
   * Campos de los objetos en los datos de la tabla que se utilizarán para identificar cada fila.
   * @type {any[]}
   */
  @Input() campos: any[] = [];

  /**
   * Indica si se mostrará la botonera en la tabla.
   * @type {boolean}
   */
  @Input() botonera: boolean = true;

  /**
   * Indica si se mostrará el botón de edición en la tabla.
   * @type {boolean}
   */
  @Input() botonEdit: boolean = true;

  /**
   * Indica si se mostrará el botón de eliminación en la tabla.
   * @type {boolean}
   */
  @Input() botonDelete: boolean = true;

  /**
   * Indica si se mostrará el botón de cambio de estado en la tabla.
   * @type {boolean}
   */
  @Input() botonEstado: boolean = true;

  /**
   * Indica si se mostrará el botón de ver detalles en la tabla.
   * @type {boolean}
   */
  @Input() botonVer: boolean = false;

  /**
   * Indica si se mostrarán casillas de verificación en la tabla.
   * @type {boolean}
   */
  @Input() checks: boolean = true;

  /**
   * Indica si se mostrarán opciones de casillas de verificación en la tabla.
   * @type {boolean}
   */
  @Input() checksOptions: boolean = true;

  /**
   * Indica si se mostrará la casilla de verificación para eliminar en la tabla.
   * @type {boolean}
   */
  @Input() checkDelete: boolean = true;

  /**
   * Indica si se mostrará la casilla de verificación para desactivar en la tabla.
   * @type {boolean}
   */
  @Input() checkDesactive: boolean = true;

  /**
   * Tamaño de página para la paginación de la tabla.
   * @type {number}
   */
  @Input() pageSize: number = 4;

  /**
   * Nombre de la tabla.
   * @type {string}
   */
  @Input() tableName: string = "default";

  /**
   * Evento emitido cuando se realiza la acción de eliminar elementos seleccionados.
   * @type {EventEmitter<any>}
   */
  @Output() eliminarAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento emitido cuando se realiza la acción de seleccionar elementos.
   * @type {EventEmitter<any>}
   */
  @Output() checkedAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento emitido cuando se realiza una acción en una fila de la tabla.
   * @type {EventEmitter<any>}
   */
  @Output() filaAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Controlador del filtro de búsqueda de la tabla.
   * @type {FormControl}
   */
  filter: FormControl = new FormControl('', { nonNullable: true });

  /**
   * Página actual de la tabla.
   * @type {number}
   */
  page: number = 1;

  /**
   * Indica si todas las casillas de verificación están seleccionadas.
   * @type {boolean}
   */
  isCheckedAll: boolean = false;

  /**
   * Icono para el botón de cambio de estado.
   * @type {any}
   */
  icon: any = faToggleOff;

  /**
   * Icono para el botón de eliminación.
   * @type {any}
   */
  icon2: any = faTrash;

  /**
   * Icono para el botón de ver detalles.
   * @type {any}
   */
  icon3: any = faEye;

  /**
   * Datos auxiliares para el filtro de búsqueda de la tabla.
   * @type {any[]}
   */
  dataAux: any[] = this.data;

  /**
   * Método que se ejecuta cuando se producen cambios en las propiedades de entrada del componente.
   * @param changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && Array.isArray(changes['data'].currentValue)) {
      this.dataAux = [...changes['data'].currentValue];
    }
  }

  /**
   * Constructor del componente.
   */
  ngOnInit() {
    this.filter.valueChanges.pipe(
      debounceTime(150) // tiempo de espera en milisegundos
    ).subscribe(filterValue => {
      this.dataAux = this.filterData(this.data, filterValue.toLowerCase());
    });
  }

  /**
   * Filtra los datos de acuerdo al valor de filtro especificado.
   * @param data Los datos a filtrar.
   * @param filterValue El valor de filtro a aplicar.
   * @returns Los datos filtrados.
   */
  private filterData(data: any[], filterValue: string): any[] {
    return data.filter(objeto =>
      Object.values(objeto).some((value: any) => value.toString().toLowerCase().includes(filterValue))
    );
  }

  /**
   * Emite a los elementos seleccionados.
   * @param action Acción a realizar.
   */
  emitDataChecked(action: any) {
    const checkedData = this.dataAux.filter(item => item.isChecked === true);
    const checkedIds = checkedData.map(item => item[this.campos[0]]);
    const response = { action, data: checkedIds };
    this.checkedAction.emit(response); // envia los datos al componente padre
  }

  /**
   * Realiza la acción correspondiente a una fila seleccionada.
   * @param item Fila seleccionada.
   */
  actionCheckRow(item: any) {
    item.isChecked = !item.isChecked;
    this.emitDataChecked('checks');  
  }

  /**
   * Realiza una acción en una fila de la tabla.
   * @param id Identificador de la fila.
   * @param option Opción de la acción.
   */
  actionButtonRow(id: string, option: any) {
    this.filaAction.emit({ id, option });
  }

  /**
   * Cambia el estado de todas las casillas de verificación.
   * @param event Evento de cambio de estado.
   */
  toggleAll(event: any) {
    const estado = event.target.checked;
    const ini = (this.page - 1) * this.pageSize;
    const end = Math.min(this.page * this.pageSize - 1, this.dataAux.length - 1);

    this.dataAux.slice(ini, end + 1).forEach(item => {
      item.isChecked = estado;
    });

    if (!this.checksOptions) {
      this.emitDataChecked('checks');
    }
  }

  /**
   * Maneja el cambio de página de la tabla.
   */
  onPageChange() {
    if (this.isCheckedAll) {
      this.isCheckedAll = !this.isCheckedAll;
    }
  }

  /**
   * Limpia el filtro de búsqueda de la tabla.
   */
  clear() {
    this.filter.setValue('');
  }
}
