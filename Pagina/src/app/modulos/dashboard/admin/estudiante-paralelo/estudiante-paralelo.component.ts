import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { EstudianteCursoParalelo } from 'src/app/interfaces/EstudianteCursoParalelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { EstudianteCursoParaleloService } from 'src/app/servicios/estudiante-curso-paralelo.service';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-estudiante-paralelo',
  templateUrl: './estudiante-paralelo.component.html',
  styleUrls: ['./estudiante-paralelo.component.scss']
})
export class EstudianteParaleloComponent implements OnInit{
  constructor(
    private ngBootstrap: NgbModal, 
    private route: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService, 
    private service: EstudianteCursoParaleloService, 
    private cursoService: CursoService, 
    private serviceEstudiante: EstudianteService,
    private modalService: ModalService
    ) { }

  ngOnInit(): void {

  }

  estudiantes: Estudiante[] = [];
  idEstudiantesSelecionados: string[] = [];
  cursos: Curso[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: string[] = [];
  headersNoMatriculados = ['CÉDULA','NOMBRES'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO','ESTADO'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required]
  })
  
  onSubmit() { }

  estudiantesaction(data: any) { }
  matriculasAction(data: any) { }
}
