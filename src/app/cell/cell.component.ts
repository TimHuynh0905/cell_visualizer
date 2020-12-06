import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { MELANOMA } from '../shared/melanoma';
import * as d3 from 'd3';
import { ComponentTitles } from '../shared/cell.model';
import { CellService } from './cell.service';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})

export class CellComponent implements OnInit, AfterContentInit, AfterContentChecked {
  components = MELANOMA;
  colorMaps: ComponentTitles = new ComponentTitles();
  svg = d3.select('#cell');
  selectedComponents: string[] = [];  

  constructor(private cellService: CellService) {}

  ngOnInit() {
    const cyanMagentaScale = d3.interpolateLab('cyan', 'magenta');
    this.components.forEach(
      component => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
    );

    this.selectedComponents = this.cellService.getSelectedComponents();
    this.cellService.selectedComponentsChanged.subscribe(
      (components: string[]) => this.selectedComponents = components
    );
  }

  ngAfterContentInit() {
    this.svg = d3.select('#cell');
  }

  ngAfterContentChecked() {
    if (this.cellService.getClearBtnClickedStatus() && this.selectedComponents.length == 0) {
      this.svg.selectAll('path').transition().duration(200)
              .style('opacity', '0.2');
      this.cellService.clearBtnClickedToggle();
    }
  }
}
