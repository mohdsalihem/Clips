import { Routes } from '@angular/router';
import { AboutComponent } from 'src/app/about/about.component';
import { ClipComponent } from 'src/app/clip/clip.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { ClipListComponent } from './clip-list/clip-list.component';
import { AuthGuard } from '@angular/fire/auth-guard';

export const routes: Routes = [
  { path: '', component: ClipListComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  {
    path: 'clip/:id',
    component: ClipComponent,
  },
  {
    path: 'video',
    canActivate: [AuthGuard],
    loadChildren: () => import('./video/video.routes'),
  },
  { path: '**', component: NotFoundComponent },
];
