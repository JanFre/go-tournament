import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss'],
})
export class VenueComponent implements OnInit, OnDestroy {
  htmlContent = '';
  htmlEN = '';
  htmlPL = '';
  private subscription: Subscription;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private comSer: CommunicationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.api.getTournamentInfo().subscribe((ti) => {
      const td = Object.values(ti);
      this.htmlContent =
        this.translate.getDefaultLang() === 'en'
          ? td[0].mainPageEN
          : td[0].mainPagePL;
      this.htmlEN = td[0].venueEN;
      this.htmlPL = td[0].venue;
      this.comSer.sharedData.subscribe((lang) => {
        this.htmlContent = lang === 'en' ? this.htmlEN : this.htmlPL;
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
