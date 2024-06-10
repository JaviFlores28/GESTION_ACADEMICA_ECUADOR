import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AnioLectivo } from 'src/app/interfaces/AnioLectivo.interface';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-reporte-cursos',
  templateUrl: './reporte-cursos.component.html',
  styleUrls: ['./reporte-cursos.component.scss']
})
export class ReporteCursosComponent implements OnInit {
  constructor(
    private estudianteService: EstudianteCursoParaleloService,
    private paraleloservice: ParaleloService,
    private cursoservice: CursoService,
    private anioService: AnioLectivoService,
    private formBuilder: FormBuilder,
    private reporteServicio: ReporteService

  ) { }

  reportes = [{ id: 'listaprofesores', label: 'Lista de profesores' }, { id: 'listacursos', label: 'Lista de cursos y paralelos' }, { id: 'listaestudaintes', label: 'Lista de estudiantes por curso y paralelos' }];
  estudiantes: Estudiante[] = [];
  aniosLectivos: AnioLectivo[] = [];
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];

  form = this.formBuilder.group({
    tipo: ['', Validators.required],
    EST_CRS_PRLL_ID: [''],
    PRLL_ID: ['',],
    CRS_ID: ['',],
    AL_ID: ['',],
  });

  onSubmit() {
    this.reporteServicio.post(this.form.value).subscribe({
      next: (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'reporteCalificaciones.pdf';
        link.click();
      },
      error: (error) => console.log(error)
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadAnios();
    this.loadCursos();
    this.loadParalelo();
  }
  loadParalelo() {
    this.paraleloservice.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.paralelos = value.data;
        } else {
          console.log(value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadEstudiantes() {
    this.estudianteService.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.estudiantes = value.data;
        } else {
          console.log(value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadAnios() {
    this.anioService.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.aniosLectivos = value.data;
        } else {
          console.log(value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadCursos() {
    this.cursoservice.get().subscribe({
      next: (value) => {
        if (value.response) {
          this.cursos = value.data;
        } else {
          console.log(value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

}
