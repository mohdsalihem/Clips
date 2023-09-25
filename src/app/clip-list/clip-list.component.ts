import { DatePipe, NgFor } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';
import { FirebaseTimestampPipe } from '../pipes/firebase-timestamp.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clip-list',
  templateUrl: './clip-list.component.html',
  styles: [],
  providers: [DatePipe],
  standalone: true,
  imports: [NgFor, RouterLink, FirebaseTimestampPipe],
})
export class ClipListComponent implements OnInit, OnDestroy {
  clips: IClip[] = [];
  @Input() scrollable = true;
  clipService = inject(ClipService);

  ngOnInit(): void {
    this.clipService.getClips(true);
    this.clips = this.clipService.pageClips;
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  // More clips when scroll
  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      this.clipService.getClips(false);
      this.clips = this.clipService.pageClips;
    }
  };
}
