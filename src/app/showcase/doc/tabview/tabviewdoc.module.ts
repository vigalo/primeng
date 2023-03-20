import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { BasicDoc } from './basicdoc';
import { ControlledDoc } from './controlleddoc';
import { DisabledDoc } from './disableddoc';
import { TemplateDoc } from './customtemplatedoc';
import { ImportDoc } from './importdoc';
import { ClosableDoc } from './closabledoc';
import { ScrollableDoc } from './scrollabledoc';
import { StyleDoc } from './styledoc';
import { PropsDoc } from './propsdoc';
import { EventsDoc } from './eventsdoc';
import { TemplatesDoc } from './templatesdoc';

@NgModule({
    imports: [CommonModule, AppCodeModule, AppDocModule, TabViewModule, RouterModule, ButtonModule],
    exports: [AppDocModule],
    declarations: [ImportDoc, BasicDoc, ControlledDoc, DisabledDoc, TemplateDoc, ClosableDoc, ScrollableDoc, StyleDoc, PropsDoc, EventsDoc, TemplatesDoc]
})
export class TabViewDocModule {}