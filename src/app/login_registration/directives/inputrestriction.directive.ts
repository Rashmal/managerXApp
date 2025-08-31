import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputrestriction]',
  standalone: false
})
export class InputrestrictionDirective {

  @Input('inputrestriction') InputRestriction: string = "";

  private element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  @HostListener('keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    var regex = new RegExp(this.InputRestriction);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  @HostListener('paste', ['$event']) onPaste(e: ClipboardEvent) {
    let event = e.clipboardData!.getData('text');

    var regex = new RegExp(this.InputRestriction);

    if (!regex.test(event)) {
      //e.preventDefault();
      setTimeout(() => {
        // Getting the existing word
        let sentenceExists: string = this.element.nativeElement.value;
        let sentenceNewWord: string = "";
        // Loop through the characters
        for (let i = 0; i < sentenceExists.length; i++) {
          // Getting the current letter
          let letter = sentenceExists.charAt(i);
          // Check if its match with the regex
          if (regex.test(letter)) {
            sentenceNewWord += letter;
          }
          // End of Check if its match with the regex
        }
        // Setting the new sentence
        this.element.nativeElement.value = sentenceNewWord;
        this.element.nativeElement.dispatchEvent(new Event('input'))
      }, 1)
    }

  }

}

