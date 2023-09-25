import { DatePipe, NgFor } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';
import { FirebaseTimestampPipe } from '../pipes/firebase-timestamp.pipe';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-clips-list',
    templateUrl: './clips-list.component.html',
    styles: [],
    providers: [DatePipe],
    standalone: true,
    imports: [
        NgFor,
        RouterLink,
        FirebaseTimestampPipe,
    ],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  clips: IClip[] = [];
  @Input() scrollable = true;

  constructor(private clipsService: ClipService) {}

  ngOnInit(): void {
    this.clipsService.getClips(true);
    this.clips = this.clipsService.pageClips;
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
      this.clipsService.getClips(false);
      this.clips = this.clipsService.pageClips;
    }
  };
}
