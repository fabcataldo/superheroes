import { fakeAsync, tick } from '@angular/core/testing';
import { UppercaseDirective } from './uppercase.directive';
import { ElementRef } from '@angular/core';

describe('UppercaseDirective', () => {
  let directive: UppercaseDirective;
  let elementInput: ElementRef;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement('input') as HTMLInputElement;
    elementInput = new ElementRef(inputElement);
    directive = new UppercaseDirective(elementInput);

  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should change input text to uppercase on input event', fakeAsync(() => {
    inputElement.value = 'testvalue';
    directive.ngAfterViewInit();
    tick(1000);
    expect(inputElement.value).toBe('TESTVALUE');
  }));
});
