import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})

//custom atribute directive type
export class UppercaseDirective {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    //1000ms is added, due to the fake delay added on chargin hero data to edit
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
    }, 1000);
  }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
