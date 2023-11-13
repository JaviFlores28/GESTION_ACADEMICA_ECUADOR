import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';

@Component({
  selector: 'app-paralelo-estudiante',
  templateUrl: './paralelo-estudiante.component.html',
  styleUrls: ['./paralelo-estudiante.component.scss']
})
export class ParaleloEstudianteComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder, 
    private serviceCurso: CursoService, 
    private serviceParalelo: ParaleloService, 
    private serviceParaleloestudiante: EstudianteCursoParaleloService
  ) {
    this.subscribeToCRS_IDChanges();
    this.subscribeToPRLL_IDChanges();
  }
  
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  estudiantes: Estudiante[] = [];
  paraleloEstudiantes: Estudiante[] = [];
  itemsChecks: string[] = []
  headers = ['CÉDULA', 'NOMBRES'];

  icon = faInfoCircle;

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required],
    PRLL_ID: ['', Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos()
  }

  onSubmit() { }

   subscribeToCRS_IDChanges() {
    this.form.get('CRS_ID')?.valueChanges.subscribe(newValue => {
      this.loadEstudiantes(newValue);
      this.form.get('PRLL_ID')?.setValue('');
      this.loadParalelos(newValue);
    });
  }

   subscribeToPRLL_IDChanges() {
    this.form.get('PRLL_ID')?.valueChanges.subscribe(newValue => {
      if (newValue) {
        this.loadParaleloEstudiante(newValue);
      }
    });
  }
  

  loadCursos() {
    this.serviceCurso.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.cursos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParalelos(cursoId: any) {
    this.serviceParalelo.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.paralelos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadEstudiantes(cursoid: any) {
    this.serviceCurso.get().subscribe({
      next: (value) => {
        if (value.data) {
          this.estudiantes = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParaleloEstudiante(paraleloId: any) {
    this.serviceParaleloestudiante.getEnabled(paraleloId).subscribe({
      next: (value) => {
        if (value.message=='') {
          this.paraleloEstudiantes = value.data;
        } else {
          console.error(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  get selectedLabel() {
    return this.paralelos.find(item => item.PRLL_ID === this.form.value.PRLL_ID)?.PRLL_NOM;
  }

  checkedsAction(event: any) {
    this.itemsChecks = event.data
    console.log(this.itemsChecks);
  }
  checkedsAction2(event: any) {
    console.log(this.itemsChecks);
  }

}
