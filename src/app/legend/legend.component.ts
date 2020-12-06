import { Component, OnInit } from '@angular/core';
import { CellService } from '../cell/cell.service';
import { MELANOMA } from '../shared/melanoma';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {
  components = MELANOMA;
  maxLog: number = -1;

  constructor(private cellService: CellService) {}

  ngOnInit() {
    this.components.forEach(
      component => this.maxLog = component.log_min_pval && this.maxLog < component.log_min_pval
        ? parseFloat(component.log_min_pval.toFixed(2)) 
        : parseFloat(this.maxLog.toFixed(2))
    );
  }
}
