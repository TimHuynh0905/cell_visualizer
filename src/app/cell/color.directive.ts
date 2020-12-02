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
  @HostBinding('style.transition-duration') transition: string = '0.2s';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.opacity = this.defaultOpacity;
  }

  @HostListener('document:click', ['$event']) clickEl(eventData: Event) {
    console.log(eventData.target);
  }

  @HostListener('mouseenter') mouseOver(eventData: Event) {
    this.opacity = this.highlightOpacity;
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    this.opacity = this.defaultOpacity;
  }
}
