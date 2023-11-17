import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Curso } from "src/app/interfaces/Curso.interface";
import { Estudiante } from "src/app/interfaces/Estudiante.interface";
import { EstudianteCursoParalelo } from "src/app/interfaces/EstudianteCursoParalelo.interface";
import { CursoService } from "src/app/servicios/curso.service";
import { EstudianteCursoService } from "src/app/servicios/estudiante-curso.service";
import { EstudianteService } from "src/app/servicios/estudiante.service";
import { UsuarioService } from "src/app/servicios/usuario.service";


@Component({
  selector: 'app-estudiante-curso',
  templateUrl: './estudiante-curso.component.html',
  styleUrls: ['./estudiante-curso.component.scss']
})
export class EstudianteCursoComponent implements OnInit {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: EstudianteCursoService, private serviceCurso: CursoService, private serviceEstudiante: EstudianteService) { }
  ngOnInit(): void {
    this.loadCursos();
    this.loadNoMatriculados();
    this.loadMatriculados();
  }

  userId = this.serviceUsuario.getUserLoggedId();
  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;

  cursos: Curso[] = [];
  noMatriculados: Estudiante[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: string[] = [];
  headersNoMatriculados = ['CÉDULA', 'NOMBRES'];
  camposNoMatriculados = ['EST_ID', 'EST_DNI', 'EST_NOM'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO', 'ESTADO'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_ID','CRS_ID'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required]
  })

  onSubmit() { }

  loadCursos() {
    this.serviceCurso.getEnabled().subscribe({
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

  loadNoMatriculados() {
    this.service.getNoMatriculados().subscribe({
      next: (value) => {
        if (value.response) {
          this.noMatriculados = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  loadMatriculados() {
    this.service.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.matriculas = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  estudiantesaction(value: any) {
    this.idsEstudiantes = value.data;
    console.log(this.idsEstudiantes);

  }
  matriculasAction(value: any) { }
}
