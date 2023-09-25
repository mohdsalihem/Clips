import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoRoutingModule } from './video-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { EditComponent } from './edit/edit.component';
import { SafeURLPipe } from './pipes/safe-url.pipe';

@NgModule({
    imports: [
        CommonModule,
        VideoRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        ManageComponent, UploadComponent, EditComponent, SafeURLPipe,
    ],
})
export class VideoModule {}
