import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';


import { UpdateUserTypeDirective } from './directives/update-user-type.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        UpdateUserTypeDirective
    ],
    imports: [
        CommonModule,
        FormsModule  // <-- important for ngModel, maxlength binding etc
    ],
    providers: [],
    bootstrap: [],
    exports: [
        UpdateUserTypeDirective,
        FormsModule  // <-- export so consuming modules get it
    ]
})
export class SharedAppModule { }
