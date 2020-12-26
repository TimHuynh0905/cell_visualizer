import { Injectable, EventEmitter } from "@angular/core";
import * as d3 from 'd3';
import { CellModel } from "src/app/shared/component.model";

@Injectable()
export class CellService {
    currentJsonFileChanged = new EventEmitter<CellModel[]>();
    selectedComponentsChanged = new EventEmitter<string[]>();
    singleSelectionChanged = new EventEmitter<string>();
    svg = d3.select('#cell');

    private currentJsonFile: CellModel[] = null;
    private selectedComponents: string[] = [];
    private singleSelection: string = '';
    private clearBtnClicked: boolean = false;

    getSelectedComponents () {
        return this.selectedComponents.slice();
    }

    getSingleSelection() {
        return this.singleSelection;
    }

    addSelectedComponent(title: string) {
        const indexExisted: number = this.selectedComponents.findIndex(
            component => component === title
        );

        // console.log(indexExisted);

        if (indexExisted >= 0) {
            this.selectedComponents.splice(indexExisted, 1);
            console.log(this.singleSelection);
            if (this.singleSelection === title) {
                this.singleSelection = '';
            }
        } else {
            this.selectedComponents.push(title);
            this.singleSelection = title;
        }

        this.singleSelectionChanged.emit(this.singleSelection);
        this.selectedComponentsChanged.emit(this.selectedComponents.slice());        
    }

    clearSelectedComponent() {
        this.clearBtnClickedToggle()
        this.selectedComponents = [];
        this.singleSelection = '';

        this.singleSelectionChanged.emit(this.singleSelection);
        this.selectedComponentsChanged.emit(this.selectedComponents);   
    }

    getClearBtnClickedStatus() {
        return this.clearBtnClicked;
    }

    clearBtnClickedToggle() {
        this.clearBtnClicked = !this.clearBtnClicked;
    }

    setCurrentJsonFile(newSelectedFile: CellModel[]) {
        this.currentJsonFile = newSelectedFile;
        this.currentJsonFileChanged.emit(this.currentJsonFile);
    }
}