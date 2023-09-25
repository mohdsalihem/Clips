import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FieldValue, Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'firebaseTimestamp',
  standalone: true,
})
export class FirebaseTimestampPipe implements PipeTransform {
  datePipe = inject(DatePipe);
  transform(value: FieldValue | undefined) {
    if (!value) {
      return '';
    }

    const date = (value as Timestamp).toDate();
    return this.datePipe.transform(date, 'mediumDate');
  }
}
