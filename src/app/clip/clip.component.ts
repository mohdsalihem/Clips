import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styles: [],
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  clip?: IClip;

  constructor(private route: ActivatedRoute, private elRef: ElementRef) {}
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.clip = data['clip'];
      const videoPlayer = this.elRef.nativeElement.querySelector(
        '#videoPlayer'
      ) as HTMLMediaElement;
      videoPlayer.load();
    });
  }
}
