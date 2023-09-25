import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { AlertComponent } from './alert/alert.component';

import { EventBlockerDirective } from './directives/event-blocker.directive';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, ModalComponent,
        TabsContainerComponent,
        TabComponent,
        InputComponent,
        AlertComponent,
        EventBlockerDirective],
    exports: [
        ModalComponent,
        TabsContainerComponent,
        TabComponent,
        InputComponent,
        AlertComponent,
        EventBlockerDirective,
    ],
    providers: [provideNgxMask()]
})
export class SharedModule {}
