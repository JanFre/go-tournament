import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  interData = '';
  sharedData: BehaviorSubject<string>;

  constructor(private api: ApiService) {
    this.sharedData = new BehaviorSubject('');
  }

  setInterData(s: string) {
    this.interData = s;
    this.sharedData.next(s);
  }

  getInterData() {
    return this.interData;
  }

}
