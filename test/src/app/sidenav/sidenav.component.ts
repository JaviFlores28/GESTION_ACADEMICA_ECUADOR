import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
interface SidenavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(public router: Router) { }

  //pagina
  titulo = 'UEFBC';
  collapsed = true;
  screenWidth = 0;
  navbarData = null;
  multiple: boolean = false;


  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.hasRol()
  }

  @Output() onToggleSideNav: EventEmitter<SidenavToogle> = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    } else {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: any): void {
    if (!this.multiple) {
      /* for (let modelItem of this.navbarData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      } */
    }
    item.expanded = !item.expanded;
  }


  getRouteActive(data: any): string {    
    let res = this.router.url.includes(data.routelink) ? 'active' : '';
    return res;
  }

  async hasRol() {
  /*   for (const element of this.navbarData) {
      const rol = await this.servicio.hasRol(element.rol || '');
      if (rol || element.rol == 'T') {
        element.visible = true;
      }
    } */
  }


}
