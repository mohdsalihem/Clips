import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styles: [],
})
export class UploadComponent implements OnDestroy {
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
  user: firebase.User | null = null;
  clipTask?: AngularFireUploadTask;
  thumbnailTask?: AngularFireUploadTask;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  uploadForm = new FormGroup({
    title: this.title,
  });

  get publishEnable() {
    return (
      !this.inSubmission && this.uploadForm.valid && this.thumbnailURL !== ''
    );
  }

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
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
    this.title.setValue(this.clipFile.name.replace(/\.[^/.]+$/, ''));
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

    this.clipTask = this.storage.upload(clipPath, this.clipFile);
    const clipRef = this.storage.ref(clipPath);

    this.thumbnailTask = this.storage.upload(thumbnailPath, this.thumbnailFile);
    const thumbnailRef = this.storage.ref(thumbnailPath);

    combineLatest([
      this.clipTask.percentageChanges(),
      this.thumbnailTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, thumbnailProgress] = progress;

      if (!clipProgress || !thumbnailProgress) {
        return;
      }

      const total = clipProgress + thumbnailProgress;

      this.percentage = total / 200;
    });

    forkJoin([
      this.clipTask.snapshotChanges(),
      this.thumbnailTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), thumbnailRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, thumbnailURL] = urls;
          const clip: IClip = {
            userID: this.user?.uid!,
            userDisplayName: this.user?.displayName!,
            title: this.title.value!,
            clipFileName: `${fileName}.mp4`,
            clipURL: clipURL,
            thumbnailURL: thumbnailURL,
            thumbnailFileName: `${fileName}.jpg`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
