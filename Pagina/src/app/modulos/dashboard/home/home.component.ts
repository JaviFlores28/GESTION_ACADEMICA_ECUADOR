import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  showNavigationArrows = false;
	showNavigationIndicators = true;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}
}
