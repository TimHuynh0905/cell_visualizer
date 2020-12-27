import { Component, OnInit } from '@angular/core';
import { JsonValueModel } from 'src/app/shared/models/json.model';
import { CellService } from '../cell/cell.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {
  maxLog: number = null;

  constructor(private cellService: CellService) {}

  ngOnInit() {
    this.cellService.currentJsonFileChanged.subscribe(
      (newFile: JsonValueModel[]) => {
        if (newFile) {
          let max = 0;
          newFile.forEach(
            component => {
              if (component.log_min_pval && max < component.log_min_pval) {
                max = parseFloat(component.log_min_pval.toFixed(2));
              }
            }
          );
          this.maxLog = max;
        }
      }
    );
  }
}
