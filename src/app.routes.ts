import { Routes } from '@angular/router';
import { AboutComponent } from 'src/app/about/about.component';
import { ClipComponent } from 'src/app/clip/clip.component';
import { HomeComponent } from 'src/app/home/home.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { ClipService } from 'src/app/services/clip.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'clip/:id',
    component: ClipComponent,
    resolve: {
      clip: ClipService,
    },
  },
  {
    path: 'video',
    loadChildren: () => import('./app/video/video.routes'),
    //   loadChildren: async () =>
    //     (await import('./video/video.module')).VideoModule,
  },
  { path: '**', component: NotFoundComponent },
];
