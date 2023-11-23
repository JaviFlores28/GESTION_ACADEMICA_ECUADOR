import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { fadeInOut } from '../helper';
import { NavBarData } from 'src/app/sistema/interfaces/NavBarData.interface';
import { faAngleDown, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sub-level-menu',
  templateUrl: './sub-level-menu.component.html',
  styleUrls: ['./sub-level-menu.component.scss'],
  animations: [fadeInOut, trigger('submenu', [state('hidden', style({ height: '0', overflow: 'hidden' })), state('visible', style({ height: '*' })), transition('visible<=>hidden', [style({ overflow: 'hidden' })]), transition('void=>*', animate(0))])],
})
export class SubLevelMenuComponent implements OnInit {
  constructor() {}

  circle = faCircle;
  angleDown = faAngleDown;
  angleRight = faAngleRight;

  @Input() collapsed = false;
  @Input() multiple: boolean = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() data: NavBarData = {
    routelink: '',
    icon: undefined,
    label: '',
    items: [],
  };

  ngOnInit(): void {}

  handleClick(item: any): void {
    item.expanded = !item.expanded;
  }
}
