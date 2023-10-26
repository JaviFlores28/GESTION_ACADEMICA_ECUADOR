import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-anio-lectivo',
  templateUrl: './anio-lectivo.component.html',
  styleUrls: ['./anio-lectivo.component.scss']
})
export class AnioLectivoComponent implements OnInit{
  constructor(private servicio: UsuarioService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  modoEdicion: boolean = false;
  elementoId: number = 0;

  anioForm = this.formBuilder.group({
    ini: [this.getFormattedToday(), Validators.required],
    fin: [this.getFormattedToday(), Validators.required],
    per: ['1', Validators.required],
    par: ['1', Validators.required],
    ex: ['1', Validators.required],
    extr: ['1', Validators.required],
    pper: ['80', Validators.required],
    pex: ['20', Validators.required],
    estado: [false, Validators.required],
    estado1: ['', Validators.required],
  })

  ngOnInit(): void {
    this.validarEdicion();
  }

  onSubmit() {
    if (this.modoEdicion) {
    //  this.editar();
    }else{
     // this.crear();
    }
  }

  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = +id;
       // this.loadData();
      } else {
        this.modoEdicion = false;
        this.elementoId = 0;
      }
    });
  }
  

  getFormattedToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dayString = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${monthString}-${dayString}`;
  }

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dayString = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${monthString}-${dayString}`;
  }



}
