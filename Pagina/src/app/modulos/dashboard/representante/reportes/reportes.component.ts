import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  constructor(private anioLectivoService: AnioLectivoService, private reporteService: ReporteService) {
  }
  options: any[] = [];
  form = new FormGroup({
    select: new FormControl(''),
  });
  data: any[] = [{DNI:2200424378,name:'Carlos Cunalata',para:'A',cursoo:'1 EGB'}];
  headers: string[] = ['DNI', 'Nombres', 'Paralelo', 'curso']

  selectedValue:string='';
 

  ngOnInit(): void {
    this.anioLectivoService.get().subscribe(data => {
      //this.options = data;
    });
  }

  onSubmit() {
    this.selectedValue = this.form.get('select')?.value ?? '';
    
  }

  obtenerValores(campo: any): string[] {
    return Object.entries(campo)
      .filter(([key]) => key !== 'id') // Filtrar campos que no sean "id"
      .map(([_, value]) => value as string); // Realizar una verificación de tipo
  }

  generarPDF(id: string) {
     /* // Crear una instancia de jsPDF
     const doc = new jsPDF();

     // Agregar contenido al PDF
     doc.text('¡Hola, este es un PDF generado desde Angular con jsPDF!', 10, 10);
 
     // Guardar el archivo PDF con un nombre específico
     doc.save('mi_archivo.pdf');
    console.log('Generando PDF para el ID:'+this.selectedValue, id);
 */
  }
}
