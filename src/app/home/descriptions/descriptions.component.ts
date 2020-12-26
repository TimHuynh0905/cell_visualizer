import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { CellService } from '../cell/cell.service';
import { MELANOMA } from '../../shared/melanoma';
import { CellModel } from 'src/app/shared/component.model';


@Component({
  selector: 'app-descriptions',
  templateUrl: './descriptions.component.html',
  styleUrls: ['./descriptions.component.css']
})

export class DescriptionsComponent implements OnInit, AfterContentChecked {
  currentJsonFile: CellModel[] = null;
  
  singleSelection: string = '';

  Title: string = 'N/A';
  ID: string = 'N/A';
  min_pval: string = 'N/A';
  log_min_pval: string = 'N/A';
  interpolate: string = 'N/A';

  constructor(private cellService: CellService) {}

  ngOnInit() {
    this.cellService.currentJsonFileChanged.subscribe(
      (newFile: CellModel[]) => this.currentJsonFile = newFile
    );

    this.singleSelection = this.cellService.getSingleSelection();
    this.cellService.singleSelectionChanged.subscribe(
      (component: string) => this.singleSelection = component
    );
  }

  ngAfterContentChecked() {
    if (this.currentJsonFile && this.singleSelection != '') {
      const cellComponent = this.currentJsonFile.find(
        component => component.Title === this.singleSelection
      );
      if (cellComponent) {
        this.Title = cellComponent.Title ? cellComponent.Title : 'N/A';
        this.ID = cellComponent.ID ? cellComponent.ID : 'N/A';
        this.min_pval = cellComponent.min_pval ? cellComponent.min_pval.toFixed(2) : 'N/A';
        this.log_min_pval = cellComponent.log_min_pval ? cellComponent.log_min_pval.toFixed(2) : 'N/A';
        this.interpolate = cellComponent.interpolate ? cellComponent.interpolate.toFixed(2) : 'N/A';
      }
    } else {
      this.singleSelection = 'N/A';
      this.Title = 'N/A';
      this.ID = 'N/A';
      this.min_pval = 'N/A';
      this.log_min_pval = 'N/A';
      this.interpolate = 'N/A';
    }
  }

}
