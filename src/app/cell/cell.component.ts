import { Component, OnInit } from '@angular/core';
import { MELANOMA } from '../shared/melanoma';
import * as d3 from 'd3';
import { ComponentTitles } from '../shared/titles.model';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})

export class CellComponent implements OnInit {

  components = MELANOMA;
  colorMaps: ComponentTitles = new ComponentTitles();
  
  constructor() {
    const cyanMagentaScale = d3.interpolateLab('cyan', 'magenta');
    this.components.forEach(
      component => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
    );
  }

  ngOnInit() {}

}
