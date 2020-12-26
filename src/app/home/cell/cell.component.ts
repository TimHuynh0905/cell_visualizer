import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { MELANOMA } from '../../shared/melanoma';
import * as d3 from 'd3';
import { ComponentTitles } from '../../shared/cell.model';
import { CellService } from './cell.service';
import { CellModel } from 'src/app/shared/component.model';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
})

export class CellComponent implements OnInit, AfterContentInit, AfterContentChecked {
  currentJsonFile: CellModel[];
  colorMaps: ComponentTitles = new ComponentTitles();
  svg = d3.select('#cell');
  selectedComponents: string[] = [];  

  constructor(private cellService: CellService) {}

  ngOnInit() {
    const cyanMagentaScale = d3.interpolateLab('cyan', 'magenta');
    this.cellService.currentJsonFileChanged.subscribe(
      (newFile: CellModel[]) => {
        this.currentJsonFile = newFile;
        this.currentJsonFile.forEach(
          (component: CellModel) => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
        );
      }
    );
    
    if (this.currentJsonFile) {
      this.currentJsonFile.forEach(
        (component: CellModel) => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
      );
    }

    this.selectedComponents = this.cellService.getSelectedComponents();
    this.cellService.selectedComponentsChanged.subscribe(
      (components: string[]) => this.selectedComponents = components
    );
  }

  ngAfterContentInit() {
    // console.log('cell component: ngAfterContentInit');
    this.cellService.svg = d3.select('#cell');
  }

  ngAfterContentChecked() {
    // console.log('cell component: ngAfterContentChecked');
    if (this.cellService.getClearBtnClickedStatus() && this.selectedComponents.length == 0) {
      this.cellService.svg.selectAll('path').transition().duration(200)
              .style('opacity', '0.2');
      this.cellService.clearBtnClickedToggle();
    }
  }
}
