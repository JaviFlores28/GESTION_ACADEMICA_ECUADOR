import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavBarData } from 'src/app/sistema/interfaces/NavBarData.interface';
import { SidenavToogle } from 'src/app/sistema/interfaces/sideNav.interface';
import { fadeInOut } from '../helper';
import { navbarData } from '../nav-data';
import { faAngleDown, faAngleRight, faBars, faSchoolFlag } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [fadeInOut],
})
export class SidenavComponent implements OnInit {
  constructor(
    public router: Router,
    public servicio: UsuarioService,
  ) {}

  //pagina
  titulo = 'UEFBC';
  collapsed = true;
  screenWidth = 0;
  navbarData = navbarData;
  multiple: boolean = false;

  //iconos
  angleRight = faAngleRight;
  bars = faBars;
  angleDown = faAngleDown;
  school = faSchoolFlag;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.hasRol();
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

  handleClick(item: NavBarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navbarData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getRouteActive(data: NavBarData): string {
    let res = this.router.url.includes(data.routelink) ? 'active' : '';
    return res;
  }

  async hasRol() {
    for (const element of this.navbarData) {
      const rol = await this.servicio.hasRol(element.rol || '');
      if (rol || element.rol == 'T') {
        element.visible = true;
      }
    }
  }
}
