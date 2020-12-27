import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { JsonKeyModel, JsonValueModel } from '../../shared/models/json.model';
import { CellService } from './cell.service';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
})

export class CellComponent implements OnInit, AfterContentInit, AfterContentChecked {
  currentJsonFile: JsonValueModel[];
  colorMaps: JsonKeyModel = new JsonKeyModel();
  svg = d3.select('#cell');
  selectedComponents: string[] = [];  

  constructor(private cellService: CellService) {}

  ngOnInit() {
    const cyanMagentaScale = d3.interpolateLab('cyan', 'magenta');
    this.cellService.currentJsonFileChanged.subscribe(
      (newFile: JsonValueModel[]) => {
        this.currentJsonFile = newFile;
        this.currentJsonFile.forEach(
          (component: JsonValueModel) => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
        );
      }
    );
    
    if (this.currentJsonFile) {
      this.currentJsonFile.forEach(
        (component: JsonValueModel) => this.colorMaps[component.Title] = component.interpolate ? cyanMagentaScale(component.interpolate) : 'white'
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
