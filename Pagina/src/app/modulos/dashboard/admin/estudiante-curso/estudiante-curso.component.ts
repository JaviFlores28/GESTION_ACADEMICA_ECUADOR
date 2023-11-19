import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Curso } from "src/app/interfaces/Curso.interface";
import { Estudiante } from "src/app/interfaces/Estudiante.interface";
import { EstudianteCursoParalelo } from "src/app/interfaces/EstudianteCursoParalelo.interface";
import { CursoService } from "src/app/servicios/curso.service";
import { EstudianteCursoService } from "src/app/servicios/estudiante-curso.service";
import { ModalService } from "src/app/servicios/modal.service";
import { UsuarioService } from "src/app/servicios/usuario.service";


@Component({
  selector: 'app-estudiante-curso',
  templateUrl: './estudiante-curso.component.html',
  styleUrls: ['./estudiante-curso.component.scss']
})
export class EstudianteCursoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService, 
    private service: EstudianteCursoService, 
    private cursoService: CursoService, 
    private modalService: ModalService
    ) { }
  
  ngOnInit(): void {
    this.loadCursos();
    this.loadNoMatriculados();
    this.loadMatriculados();
  }

  userId = this.usuarioService.getUserLoggedId();
  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  icon = faInfoCircle;

  cursos: Curso[] = [];
  noMatriculados: Estudiante[] = [];
  matriculas: EstudianteCursoParalelo[] = [];
  idsEstudiantes: string[] = [];
  headersNoMatriculados = ['CÉDULA', 'NOMBRES'];
  camposNoMatriculados = ['EST_ID', 'EST_DNI', 'EST_NOM'];
  headersMatriculados = ['CÉDULA', 'NOMBRES', 'CURSO', 'ESTADO'];
  camposMatriculados = ['EST_CRS_ID', 'EST_DNI', 'EST_ID', 'CRS_ID'];

  form = this.formBuilder.group({
    CRS_ID: ['', Validators.required]
  })

  onSubmit() {
    this.openConfirmationModal(this.msg);
  }

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
  }

  matriculasAction() { }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string) {
    this.modalService.openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
