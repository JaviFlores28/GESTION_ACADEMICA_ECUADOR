import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard, authGuardLogin } from 'src/app/guards/auth.guard';
import { InicioComponent } from './inicio/inicio.component';
import { CursoComponent } from './admin/curso/curso.component';
import { CursosComponent } from './admin/cursos/cursos.component';
import { AnioActivoComponent } from './admin/anio-activo/anio-activo.component';
import { AreaComponent } from './admin/area/area.component';
import { AsignaturasComponent } from './admin/asignaturas/asignaturas.component';
import { ProfesoresComponent } from './admin/profesores/profesores.component';
import { RepresentantesComponent } from './admin/representantes/representantes.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { MatriculasComponent } from './admin/matriculas/matriculas.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [authGuardLogin] },
  {
    path: 'dashboard', component: HomeComponent, canActivate: [authGuard],
    children: [
      { path: '', component: InicioComponent },
      { path: 'home', component: CursoComponent },
      {
        path: 'docente',
        children: [{
          path: '', component: CursosComponent
        }]
      },
      {
        path: 'representante',
        children: [{
          path: '', component: CursosComponent
        }]
      },
      {
        path: 'institucion',
        children: [
          { path: 'anio-lectivo', component: AnioActivoComponent },
          { path: 'areas', component: AreaComponent },
          { path: 'asignaturas', component: AsignaturasComponent },
          { path: 'profesores', component: ProfesoresComponent },
          { path: 'cursos', component: CursosComponent },
          { path: 'representantes', component: RepresentantesComponent },
          { path: 'estudiantes', component: EstudiantesComponent },
          { path: 'matriculas', component: MatriculasComponent },]
      },
      {
        path: 'usuarios',
        children: [
          { path: '', component: UsuariosComponent, },
          { path: ':id', component: UsuarioComponent },
        ]

      },


    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
