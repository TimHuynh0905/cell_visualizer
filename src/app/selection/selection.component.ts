import { Component, OnInit } from '@angular/core';
import { CellService } from '../cell/cell.service';
import { MELANOMA } from '../shared/melanoma';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  components = MELANOMA;
  selectedComponents: string[];
  singleSelection: string;
  
  constructor(private cellService: CellService) {}

  ngOnInit() {
    this.selectedComponents = this.cellService.getSelectedComponents();
    this.singleSelection = this.cellService.getSingleSelection();

    this.cellService.selectedComponentsChanged.subscribe(
      (components: string[]) => this.selectedComponents = components
    );
    this.cellService.singleSelectionChanged.subscribe(
      (component: string) => this.singleSelection = component
    );
  }

  onClearSelections() {
    this.cellService.clearSelectedComponent();
  }
  
}
