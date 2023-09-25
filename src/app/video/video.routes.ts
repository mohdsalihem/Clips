import { AuthGuard } from '@angular/fire/auth-guard';
import { VideoManageComponent } from './video-manage/video-manage.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';

export default [
  {
    path: 'manage',
    component: VideoManageComponent,
  },
  {
    path: 'upload',
    component: VideoUploadComponent,
  },
];
