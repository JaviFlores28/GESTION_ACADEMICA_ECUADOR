import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Curso } from 'src/app/modelos/interfaces/Curso.interface';
import { Estudiante } from 'src/app/modelos/interfaces/Estudiante.interface';
import { Paralelo } from 'src/app/modelos/interfaces/Paralelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';

@Component({
  selector: 'app-paralelo-estudiante',
  templateUrl: './paralelo-estudiante.component.html',
  styleUrls: ['./paralelo-estudiante.component.scss']
})
export class ParaleloEstudianteComponent implements OnInit {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceCurso: CursoService, private serviceParalelo: ParaleloService, private serviceEstudiante: EstudianteService) {// Suscribirse a cambios en CRS_ID
    this.form.get('CRS_ID')?.valueChanges.subscribe(newValue => {
      // Aquí puedes ejecutar tu código cuando el valor de CRS_ID cambie
      return this.loadEstudiantes(newValue);      
    });
  }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  estudiantes: Estudiante[] = [];
  icon = faInfoCircle;

  form = this.formBuilder.group({
    PRLL_ID: ['', Validators.required],
    CRS_ID: ['', Validators.required],
    MTR_ID: ['', Validators.required],
    ESTADO: [false, Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos()
    this.loadParalelos()
  }

  onSubmit() { }

  loadCursos() {
    this.serviceCurso.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.cursos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParalelos() {
    this.serviceParalelo.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.paralelos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadEstudiantes(cursoid:any) {
    this.serviceEstudiante.getByCurso(cursoid).subscribe({
      next: (value) => {
        if (value.data) {
          this.estudiantes = value.data
          console.log(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
