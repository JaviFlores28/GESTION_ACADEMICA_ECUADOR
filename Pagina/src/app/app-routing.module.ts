import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./modulos/dashboard/dashboard.module').then((m) => m.DashboardModule) },
  { path: 'pagina', loadChildren: () => import('./modulos/pagina/pagina.module').then((m) => m.PaginaModule) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
