import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class CellService {
    selectedComponentsChanged = new EventEmitter<string[]>();
    singleSelectionChanged = new EventEmitter<string>();

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
}