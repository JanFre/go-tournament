import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/notification.service';
import { NotificationType } from 'src/app/entities/notification';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {}

  writeContents(content: string, fileName: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  uploadDropedFilesWithResults(ev, callback): void {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      for (const f of ev.dataTransfer.items) {
        if (f.kind === 'file') {
          const file = f.getAsFile();
          if (file.type.indexOf('text') === 0) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
              callback(reader.result as string);
            };
          } else {
            const msg = this.translate.instant('WRONG_FILE_TYPE');
            this.notificationService.displayNotification(
              msg,
              NotificationType.error
            );
          }
        }
      }
    }
  }

  uploadFilesWithResults(ev, callback): void {
    for (const file of ev) {
      if (file.type.indexOf('text') === 0) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          callback(reader.result as string);
        };
      } else {
        const msg = this.translate.instant('WRONG_FILE_TYPE');
        this.notificationService.displayNotification(
          msg,
          NotificationType.error
        );
      }
    }
  }
}
