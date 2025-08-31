import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: false
})
export class OnlyNumbersDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) 
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');
    this.ngControl.control?.setValue(cleaned);
  }
}
