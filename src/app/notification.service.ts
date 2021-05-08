import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationType } from './entities/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  displayNotification(info: string, type: NotificationType): void {
    switch (type) {
      case NotificationType.success: {this.toastr.success(info); break; }
      case NotificationType.warning: {this.toastr.warning(info); break; }
      case NotificationType.error: {this.toastr.error(info); break; }
    }
  }

  displaySuccess(info: string) {
    this.toastr.success(info);
  }

  displayWarning(info: string) {
    this.toastr.warning(info);
  }

  displayError(info: string) {
    this.toastr.error(info);
  }

}
