import { FieldValue } from '@angular/fire/firestore';

export default interface IClip {
  docID?: string;
  userID: string;
  userDisplayName: string;
  title: string;
  clipFileName: string;
  clipURL: string;
  timestamp: FieldValue;
  thumbnailURL: string;
  thumbnailFileName: string;
}
