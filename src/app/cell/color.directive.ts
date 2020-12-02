import { Directive, HostListener, HostBinding, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Directive({
  selector: '[colorDirective]'
})

export class ColorDirective implements OnInit {
  defaultOpacity: string = '0.3';
  highlightOpacity: string = '1';
  svg = d3.select('#cell');

  @HostBinding('style.opacity') opacity: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.opacity = this.defaultOpacity;
  }

  // @HostListener('click') clickEl(eventData: Event) {
  //   console.log(this.elementRef.nativeElement.id);
  //   console.log(this.svg.selectAll(`path#${this.elementRef.nativeElement.id}`));
  //   this.svg.selectAll(`path#${this.elementRef.nativeElement.id}`)
  //           .transition().duration(200)
  //           .style('opacity', this.highlightOpacity);
  // }

  @HostListener('mouseenter') mouseOver(eventData: Event) {
    this.svg.selectAll(`path#${this.elementRef.nativeElement.id}`)
            .transition().duration(200)
            .style('opacity', this.highlightOpacity);
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    this.svg.selectAll(`path#${this.elementRef.nativeElement.id}`)
            .transition().duration(200)
            .style('opacity', this.defaultOpacity);
  }
}
