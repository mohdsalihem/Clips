import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { VideoEditComponent } from '../video-edit/video-edit.component';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { destroyNotifier } from 'src/app/helpers/destroyNotifier';

@Component({
  selector: 'app-video-manage',
  templateUrl: './video-manage.component.html',
  styles: [],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor, VideoEditComponent],
})
export class VideoManageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  clipService = inject(ClipService);
  modalService = inject(ModalService);

  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$ = new BehaviorSubject(this.videoOrder);
  destroy$ = destroyNotifier();

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
        this.sort$.next(this.videoOrder);
      });
    this.clipService
      .getUserClips(this.sort$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((docs) => {
        this.clips = [];
        if (!docs) {
          return;
        }
        docs.forEach((doc) => {
          this.clips.push({
            docID: doc.id,
            ...doc.data(),
          });
        });
      });
  }

  sort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal();
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == $event.docID) {
        this.clips[index].title = $event.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.clipService.deleteClip(clip);

    this.clips = this.clips.filter((element) => element.docID !== clip.docID);
  }

  async copyToClipboard($event: Event, docID: string | undefined) {
    $event.preventDefault();
    if (!docID) {
      return;
    }

    const url = `${location.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('Link Copied!');
  }
}
