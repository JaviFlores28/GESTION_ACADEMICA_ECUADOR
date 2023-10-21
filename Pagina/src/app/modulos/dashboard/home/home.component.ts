import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private service: UsuarioService) { }

  ngOnInit(): void {
    this.getuser()
  }

  getuser() {
    let usuario = this.service.getUserInfo();
    console.log(usuario);

  }
}
