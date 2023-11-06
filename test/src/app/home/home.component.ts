import { Component } from '@angular/core';
interface SidenavToogle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  screenWidth = window.innerWidth;
  isSideNavCollapsed = true;

  onToggleSideNav(data: SidenavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    console.log(this.screenWidth);
    
  }
}
