import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AnioLectivoComponent } from './admin/anio-lectivo/anio-lectivo.component';
import { AniosLectivosComponent } from './admin/anios-lectivos/anios-lectivos.component';
import { AreaComponent } from './admin/area/area.component';
import { AreasComponent } from './admin/areas/areas.component';
import { AsignaturaComponent } from './admin/asignatura/asignatura.component';
import { AsignaturasComponent } from './admin/asignaturas/asignaturas.component';
import { CursoComponent } from './admin/curso/curso.component';
import { CursosComponent } from './admin/cursos/cursos.component';
import { EstudianteComponent } from './admin/estudiante/estudiante.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { MatriculaComponent } from './admin/matricula/matricula.component';
import { MatriculasComponent } from './admin/matriculas/matriculas.component';
import { ParaleloComponent } from './admin/paralelo/paralelo.component';
import { ParalelosComponent } from './admin/paralelos/paralelos.component';
import { ProfesorComponent } from './admin/profesor/profesor.component';
import { ProfesoresComponent } from './admin/profesores/profesores.component';
import { RepresentanteComponent } from './admin/representante/representante.component';
import { RepresentantesComponent } from './admin/representantes/representantes.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { BodyComponent } from './dashboard/body/body.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    AnioLectivoComponent,
    AniosLectivosComponent,
    AreaComponent,
    AreasComponent,
    AsignaturaComponent,
    AsignaturasComponent,
    CursoComponent,
    CursosComponent,
    EstudianteComponent,
    EstudiantesComponent,
    MatriculaComponent,
    MatriculasComponent,
    ParaleloComponent,
    ParalelosComponent,
    HomeComponent,
    ProfesorComponent,
    ProfesoresComponent,
    RepresentanteComponent,
    RepresentantesComponent,
    UsuarioComponent,
    UsuariosComponent,
    BodyComponent,
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class DashboardModule { }
