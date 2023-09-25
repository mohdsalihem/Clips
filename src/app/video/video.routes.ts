import { AuthGuard } from '@angular/fire/auth-guard';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

export default [
  {
    path: 'manage',
    component: ManageComponent,
    data: { authOnly: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: { authOnly: true },
    canActivate: [AuthGuard],
  },
];
