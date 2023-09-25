import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  CollectionReference,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, delay, map, filter } from 'rxjs';
import IUser from '../models/user.model';
import { Router, ActivationStart } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: CollectionReference<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  redirect = false;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router,
  ) {
    this.usersCollection = collection(
      this.db,
      'users',
    ) as CollectionReference<IUser>;
    this.isAuthenticated$ = authState(this.auth).pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this.router.events
      .pipe(
        filter((e) => e instanceof ActivationStart),
        map((e) => e as ActivationStart),
        map((e) => e.snapshot.data['authOnly'] ?? false),
      )
      .subscribe((val) => (this.redirect = val));
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided!');
    }

    const userCred = await createUserWithEmailAndPassword(
      this.auth,
      userData.email,
      userData.password,
    );

    if (!userCred.user) {
      throw new Error("User can't be found");
    }

    await setDoc(doc(this.usersCollection, userCred.user.uid), {
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await updateProfile(userCred.user, {
      displayName: userData.name,
    });
  }

  async logout() {
    await this.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    if (this.redirect) {
      await this.router.navigate(['/']);
    }
  }
}
