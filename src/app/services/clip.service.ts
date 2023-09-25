import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  limit,
  startAfter,
} from '@angular/fire/firestore';
import IClip from '../models/clip.model';
import { Auth, authState } from '@angular/fire/auth';
import { switchMap, map, combineLatestWith, of, BehaviorSubject } from 'rxjs';
import { Storage, deleteObject, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  store = inject(Firestore);
  auth = inject(Auth);
  storage = inject(Storage);

  public clipsCollection = collection(
    this.store,
    'clips',
  ) as CollectionReference<IClip>;
  pageClips: IClip[] = [];

  async getClip(id: string) {
    return (await getDoc(doc(this.clipsCollection, id))).data();
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return addDoc(this.clipsCollection, data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return authState(this.auth).pipe(
      combineLatestWith(sort$),
      switchMap((values) => {
        const [user, sort] = values;
        if (!user) {
          return of([]);
        }

        return getDocs(
          query(
            this.clipsCollection,
            where('userID', '==', user.uid),
            orderBy('timestamp', sort == '1' ? 'desc' : 'asc'),
          ),
        );
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs),
    );
  }

  updateClip(id: string, title: string) {
    return updateDoc(doc(this.clipsCollection, id), {
      title: title,
    });
  }

  async deleteClip(clip: IClip) {
    const clipRef = ref(this.storage, `clips/${clip.clipFileName}`);
    const thumbnailRef = ref(
      this.storage,
      `thumbnails/${clip.thumbnailFileName}`,
    );

    await deleteObject(clipRef);
    await deleteObject(thumbnailRef);

    await deleteDoc(doc(this.clipsCollection, clip.docID));
  }

  async getClips(isInitialClips: boolean) {
    let queryData = query(
      this.clipsCollection,
      orderBy('timestamp', 'desc'),
      limit(6),
    );

    if (isInitialClips) {
      this.pageClips = [];
    }

    // More clips
    const { length } = this.pageClips;
    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await getDoc(doc(this.clipsCollection, lastDocID));
      queryData = query(queryData, startAfter(lastDoc));
    }

    const snapshot = await getDocs(queryData);
    snapshot.forEach((doc) => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(),
      });
    });
  }
}
