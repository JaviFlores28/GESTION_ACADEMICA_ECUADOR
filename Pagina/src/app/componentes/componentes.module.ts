import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablaComponent } from './tabla/tabla.component';
import { ModalComponent } from './modal/modal.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    TablaComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports:[
    TablaComponent,
    ModalComponent
  ]
})
export class ComponentesModule { }
