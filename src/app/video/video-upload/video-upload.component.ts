import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Storage,
  StorageReference,
  UploadTask,
  getDownloadURL,
  percentage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { Auth, User, authState } from '@angular/fire/auth';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { combineLatest, forkJoin, takeUntil } from 'rxjs';
import { serverTimestamp } from '@angular/fire/firestore';
import { SafeURLPipe } from '../pipes/safe-url.pipe';
import { InputComponent } from '../../shared/input/input.component';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf, NgClass, PercentPipe } from '@angular/common';
import { destroyNotifier } from 'src/app/helpers/destroyNotifier';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styles: [],
  standalone: true,
  imports: [
    NgIf,
    AlertComponent,
    EventBlockerDirective,
    NgClass,
    ReactiveFormsModule,
    InputComponent,
    PercentPipe,
    SafeURLPipe,
  ],
})
export class VideoUploadComponent implements OnInit, OnDestroy {
  storage = inject(Storage);
  auth = inject(Auth);
  clipsService = inject(ClipService);
  router = inject(Router);

  isDragOver = false;
  clipFile: File | null = null;
  thumbnailFile: File | null = null;
  thumbnailURL: string = '';
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! Your clip is being uploaded.';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: User | null = null;
  clipTask?: UploadTask;
  thumbnailTask?: UploadTask;
  destroy$ = destroyNotifier();

  uploadForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  get publishEnable() {
    return (
      !this.inSubmission && this.uploadForm.valid && this.thumbnailURL !== ''
    );
  }

  ngOnInit(): void {
    authState(this.auth)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.clipTask?.cancel();
    this.thumbnailTask?.cancel();
  }

  storeClip($event: Event) {
    this.isDragOver = false;
    this.showAlert = false;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';

    if (($event as DragEvent).dataTransfer) {
      this.clipFile = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;
    } else {
      this.clipFile =
        ($event.target as HTMLInputElement).files?.item(0) ?? null;
    }

    if (!this.clipFile || this.clipFile.type !== 'video/mp4') {
      return;
    }

    // greater than 30MB
    if (this.clipFile.size > 30 * 1024 * 1024) {
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMessage = 'Clip size must be less than 30MB';
      return;
    }
    this.uploadForm.controls.title.setValue(
      this.clipFile.name.replace(/\.[^/.]+$/, ''),
    );
    this.nextStep = true;
  }

  storeThumbnail($event: Event) {
    this.thumbnailFile =
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.thumbnailFile || this.thumbnailFile.type !== 'image/jpeg') {
      return;
    }

    this.thumbnailURL = URL.createObjectURL(this.thumbnailFile);
  }

  uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    const fileName = uuid();
    const clipPath = `clips/${fileName}.mp4`;
    const thumbnailPath = `thumbnails/${fileName}.jpg`;

    const clipRef = ref(this.storage, clipPath);
    this.clipTask = uploadBytesResumable(clipRef, this.clipFile!);

    const thumbnailRef = ref(this.storage, thumbnailPath);
    this.thumbnailTask = uploadBytesResumable(
      thumbnailRef,
      this.thumbnailFile!,
    );

    combineLatest([percentage(this.clipTask), percentage(this.thumbnailTask)])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progress) => {
          const [clipProgress, thumbnailProgress] = progress;

          if (!clipProgress || !thumbnailProgress) {
            return;
          }

          const total = clipProgress.progress + thumbnailProgress.progress;

          this.percentage = total / 200;
        },
        complete: () => {
          this.saveFile(clipRef, thumbnailRef, fileName);
        },
      });
  }

  saveFile(
    clipRef: StorageReference,
    thumbnailRef: StorageReference,
    fileName: string,
  ) {
    forkJoin([getDownloadURL(clipRef), getDownloadURL(thumbnailRef)])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (urls) => {
          const [clipURL, thumbnailURL] = urls;
          const clip: IClip = {
            userID: this.user?.uid!,
            userDisplayName: this.user?.displayName!,
            title: this.uploadForm.controls.title.value,
            clipFileName: `${fileName}.mp4`,
            clipURL: clipURL,
            thumbnailURL: thumbnailURL,
            thumbnailFileName: `${fileName}.jpg`,
            timestamp: serverTimestamp(),
          };
          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertColor = 'green';
          this.alertMessage =
            'Success! Your clip is now ready to share with the world.';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMessage = 'Upload failed! Please try again later.';
          this.inSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
