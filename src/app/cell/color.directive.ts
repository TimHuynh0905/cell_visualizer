import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { CellService } from './cell.service';

@Directive({
  selector: '[colorDirective]'
})

export class ColorDirective implements OnInit {
  defaultOpacity: string = '0.2';
  highlightOpacity: string = '1';
  svg = d3.select('#cell');
  selectedComponents: string[] = [];

  constructor(private elementRef: ElementRef, private cellService: CellService) {}

  ngOnInit() {
    this.svg.selectAll('path').style('opacity', this.defaultOpacity);
    this.selectedComponents = this.cellService.getSelectedComponents();
    this.cellService.selectedComponentsChanged.subscribe(
      (components: string[]) => this.selectedComponents = components
    );
    
    if (this.selectedComponents.length == 0) {
      this.updateSelectedComponentsOpacity(this.defaultOpacity);
    } else {
      this.updateSelectedComponentsOpacity(this.highlightOpacity);
    }
  }

  @HostListener('click') click(eventData: Event) {
    this.cellService.addSelectedComponent(this.elementRef.nativeElement.id);
  }

  @HostListener('mouseenter') mouseOver(eventData: Event) {
    this.updateComponentOpacity(this.elementRef.nativeElement.id, this.highlightOpacity);
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    const indexExisted: number = this.selectedComponents.findIndex(
      component => component === this.elementRef.nativeElement.id
    );

    if (indexExisted < 0) {
      this.updateComponentOpacity(this.elementRef.nativeElement.id, this.defaultOpacity);
    }
  }

  updateSelectedComponentsOpacity(opacity: string) {
    this.selectedComponents.forEach(
      component => this.updateComponentOpacity(component, opacity)
    );
  }

  updateComponentOpacity(component: string, opacity: string) {
    this.svg.selectAll(`path#${component}`)
            .transition().duration(200)
            .style('opacity', opacity);
  }
}
