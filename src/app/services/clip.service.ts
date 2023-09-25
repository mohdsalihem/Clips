import { Injectable } from '@angular/core';
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
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: CollectionReference<IClip>;
  pageClips: IClip[] = [];
  pendingReq = false;

  constructor(
    private db: Firestore,
    private auth: Auth,
    private storage: Storage,
    private router: Router
  ) {
    this.clipsCollection = collection(
      this.db,
      'clips'
    ) as CollectionReference<IClip>;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return getDoc(doc(this.clipsCollection, route.params['id'])).then(
      (snapshot) => {
        const data = snapshot.data();
        if (!data) {
          this.router.navigate(['/']);
          return null;
        }

        return data;
      }
    );
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
            orderBy('timestamp', sort == '1' ? 'desc' : 'asc')
          )
        );
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
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
      `thumbnails/${clip.thumbnailFileName}`
    );

    await deleteObject(clipRef);
    await deleteObject(thumbnailRef);

    await deleteDoc(doc(this.clipsCollection, clip.docID));
  }

  async getClips(isInitialClips: boolean) {
    if (this.pendingReq) {
      return;
    }
    this.pendingReq = true;

    let queryData = query(
      this.clipsCollection,
      orderBy('timestamp', 'desc'),
      limit(6)
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

    this.pendingReq = false;
  }
}
