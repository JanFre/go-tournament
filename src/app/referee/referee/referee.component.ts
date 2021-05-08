import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from 'src/app/entities/player';
import { Tournament } from 'src/app/entities/tournament';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from './../../core/auth/auth.service';
import { FileService } from 'src/app/services/file.service';
import { RefereeHelperService } from './referee-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/notification.service';
import { NotificationType } from 'src/app/entities/notification';
import { Subscription } from 'rxjs';
import { RefereeData } from 'src/app/entities/secretdata';

@Component({
  selector: 'app-referee',
  templateUrl: './referee.component.html',
  styleUrls: ['./referee.component.scss'],
})
export class RefereeComponent implements OnInit, OnDestroy {
  refereeData: RefereeData;
  msg: string;
  private registeredPlayers: Player[] = [];
  registrationClosed: boolean;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fileService: FileService,
    private refereeHelperService: RefereeHelperService
  ) {}

  ngOnInit(): void {
    this.getPlayers();
    this.refereeData = new RefereeData();
    this.getSecretData();
    this.subscriptions.push(
      this.api.getTournamentInfo().subscribe((ti) => {
        const td = Object.values(ti) as unknown;
        const body = td[0] as Tournament;
        this.registrationClosed = body.registrationClosed;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  getPlayers(): void {
    this.subscriptions.push(
      this.api.getPlayers().subscribe((players) => {
        this.registeredPlayers = players;
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }

  exportPlayers(): void {
    let ps = '';
    for (const p of this.registeredPlayers) {
      ps += p.lastName + '|' + p.firstName + '|' + p.rate + '|';
      ps += p.country + '|' + p.club + '|' + p.gor + '||\n';
    }
    this.fileService.writeContents(ps, 'players.txt', 'text/plain');
  }

  getSecretData(): void {
    this.subscriptions.push(
      this.api.getRefereeInfo().subscribe((sd) => {
        this.refereeData.desc = Object.values(sd)[0].Description;
        this.refereeData.data = Object.values(sd)[0].Data;
      })
    );
  }

  uploadDropedFilesWithResults(ev): void {
    this.fileService.uploadDropedFilesWithResults(ev, (result) => {
      this.refereeHelperService.uploadResults(result as string);
    });
  }

  uploadFilesWithResults(ev): void {
    this.fileService.uploadFilesWithResults(ev, (result) => {
      this.refereeHelperService.uploadResults(result as string);
    });
  }

  onDragOver(event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  closeRegistration(): void {
    this.subscriptions.push(
      this.api.getTournamentInfo().subscribe((ti) => {
        const td = Object.values(ti) as unknown;
        const body = td[0] as Tournament;
        body.registrationClosed = !body.registrationClosed;
        this.subscriptions.push(
          this.api.updateTournament(body).subscribe(
            () => {
              this.registrationClosed = body.registrationClosed;
            },
            () => {
              const msg = this.translate.instant('SESSION_EXPIRED');
              this.notificationService.displayNotification(
                msg,
                NotificationType.error
              );
            }
          )
        );
      })
    );
  }
}
