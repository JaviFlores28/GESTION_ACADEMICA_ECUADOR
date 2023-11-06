import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardRoutingModule } from './dashboard-routing.module';

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
import { ProfesoresComponent } from './admin/profesores/profesores.component';
import { RepresentantesComponent } from './admin/representantes/representantes.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { BodyComponent } from './dashboard/body/body.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './login/login.component';
import { SubLevelMenuComponent } from './dashboard/sub-level-menu/sub-level-menu.component';
import { InicioComponent } from './inicio/inicio.component';
import { AnioActivoComponent } from './admin/anio-activo/anio-activo.component';
import { ParaleloEstudianteComponent } from './admin/paralelo-estudiante/paralelo-estudiante.component';
import { NgTableComponent } from "../../componentes/ng-table/ng-table.component";


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
        ProfesoresComponent,
        RepresentantesComponent,
        UsuarioComponent,
        UsuariosComponent,
        BodyComponent,
        NavbarComponent,
        SidenavComponent,
        SubLevelMenuComponent,
        InicioComponent,
        AnioActivoComponent,
        ParaleloEstudianteComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        NgbModule,
        NgSelectModule,
        NgTableComponent
    ]
})

export class DashboardModule { }
