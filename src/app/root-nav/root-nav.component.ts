import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-root-nav',
  templateUrl: './root-nav.component.html',
  styleUrls: ['./root-nav.component.scss']
})
export class RootNavComponent implements OnDestroy {

  selectLanguage = ' Choose language / Wybierz język: ';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isRegistrationClosed = false;

  private subscription: Subscription;

  constructor(private breakpointObserver: BreakpointObserver, private api: ApiService,
              private translate: TranslateService, private comSer: CommunicationService) {
    this.getTournamentInfo();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTournamentInfo() {
    this.subscription = this.api.getTournamentInfo().subscribe((info) => {
      this.isRegistrationClosed = info[0].registrationClosed;
    });
  }

  changeLanguage($event: MatRadioChange) {
    this.translate.setDefaultLang($event.value);
    this.comSer.setInterData($event.value);
  }

}
