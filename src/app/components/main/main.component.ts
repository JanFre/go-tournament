import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  htmlContent = '';
  private htmlEN = '';
  private htmlPL = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private comSer: CommunicationService
  ) {}

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.api
      .getTournamentInfo()
      .pipe(
        take(1),
        switchMap((ti) => {
          const td = Object.values(ti);
          this.htmlContent =
            this.translate.getDefaultLang() === 'en'
              ? td[0].mainPageEN
              : td[0].mainPagePL;
          this.htmlEN = td[0].mainPageEN;
          this.htmlPL = td[0].mainPage;
          return this.comSer.sharedData.pipe(takeUntil(this.destroyed$));
        })
      )
      .subscribe((lang) => {
        this.htmlContent = lang === 'en' ? this.htmlEN : this.htmlPL;
      });
  }
}
