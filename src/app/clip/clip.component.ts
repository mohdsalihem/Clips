import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';
import { FirebaseTimestampPipe } from '../pipes/firebase-timestamp.pipe';
import { ClipListComponent } from '../clip-list/clip-list.component';
import { ClipService } from '../services/clip.service';
import { destroyNotifier } from '../helpers/destroyNotifier';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styles: [],
  providers: [DatePipe],
  standalone: true,
  imports: [ClipListComponent, FirebaseTimestampPipe],
})
export class ClipComponent implements OnInit {
  clipService = inject(ClipService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  elRef = inject(ElementRef);

  clip?: IClip;
  destroy$ = destroyNotifier();

  ngOnInit(): void {
    this.getClip();
    const videoPlayer = this.elRef.nativeElement.querySelector(
      '#videoPlayer',
    ) as HTMLMediaElement;
    videoPlayer.load();
  }

  async getClip() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (params) => {
        const clip = await this.clipService.getClip(params['id']);
        if (!clip) {
          this.router.navigate(['/']);
        }
        this.clip = clip;
        window.scroll(0, 0);
      });
  }
}
