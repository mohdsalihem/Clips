import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL',
  standalone: true,
})
export class SafeURLPipe implements PipeTransform {
  domSanitizer = inject(DomSanitizer);

  transform(value: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(value);
  }
}
