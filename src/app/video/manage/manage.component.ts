import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';
import { EditComponent } from '../edit/edit.component';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styles: [],
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        NgFor,
        EditComponent,
    ],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
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
    this.modal.toggleModal();
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
