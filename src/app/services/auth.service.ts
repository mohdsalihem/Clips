import { Injectable, inject } from '@angular/core';
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
import { delay, map } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  store = inject(Firestore);

  private usersCollection = collection(
    this.store,
    'users',
  ) as CollectionReference<IUser>;
  public isAuthenticated$ = authState(this.auth).pipe(map((user) => !!user));
  public isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

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
  }
}
