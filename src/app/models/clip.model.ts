import firebase from 'firebase/compat/app';
export default interface IClip {
  docID?: string;
  userID: string;
  userDisplayName: string;
  title: string;
  clipFileName: string;
  clipURL: string;
  timestamp: firebase.firestore.FieldValue;
  thumbnailURL: string;
  thumbnailFileName: string;
}
