import { Component, OnInit } from '@angular/core';
import { SidenavToogle } from 'src/app/modelos/interfaces/sideNav.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {

  isSideNavCollapsed = true;
  screenWidth = window.innerWidth;

  onToggleSideNav(data: SidenavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
