import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modulos/dashboard/dashboard.module';
import { PaginaModule } from './modulos/pagina/pagina.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentesModule } from './componentes/componentes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule,
    PaginaModule,
    FontAwesomeModule,
    ComponentesModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
