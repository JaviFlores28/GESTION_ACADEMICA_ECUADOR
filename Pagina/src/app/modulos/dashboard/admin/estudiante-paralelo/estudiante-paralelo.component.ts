import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { EstudianteCurso } from 'src/app/interfaces/EstudianteCurso.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteCursoService } from 'src/app/servicios/estudiante-curso.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';

@Component({
  selector: 'app-estudiante-paralelo',
  templateUrl: './estudiante-paralelo.component.html',
  styleUrls: ['./estudiante-paralelo.component.scss']
})
export class EstudianteParaleloComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: EstudianteCursoParaleloService,
    private cursoService: CursoService,
    private paraleloService: ParaleloService,
    private estudianteCursoService: EstudianteCursoService,
  ) { }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  matriculas: EstudianteCurso[] = [];
  estudiantesParalelos: EstudianteCursoParalelo[] = [];

  idEstudiantesSelecionados: string[] = [];
  idsMatriculas: string[] = [];

  headersMatriculas = ['CÉDULA', 'NOMBRES'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_NOM'];
  headersEstudiantesParalelos = ['CÉDULA', 'NOMBRES', 'CURSO', 'ESTADO'];
  camposestudiantesParalelos = ['CÉDULA', 'NOMBRES', 'CURSO', 'PARALELO', 'ESTADO'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required],
    PRLL_ID: ['', Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos();
    this.loadParalelos();

    this.form.get('CRS_ID')?.valueChanges.subscribe((value) => {
      this.loadMatriculas(value || '');
    });

    this.form.get('PRLL_ID')?.valueChanges.subscribe((value) => {
      this.loadEstudianteParalelo(value || '');
    });
  }

  onSubmit() { }

  loadCursos() {
    this.cursoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
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
    this.paraleloService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
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

  loadMatriculas(cursoId: string) {
    this.estudianteCursoService.getByCurso(cursoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.matriculas = value.data
          console.log(this.matriculas);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadEstudianteParalelo(paraleloId: string) {
    this.service.getByParalelo(paraleloId).subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantesParalelos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  estudiantesaction(data: any) { }
  matriculasAction(data: any) { }
}
