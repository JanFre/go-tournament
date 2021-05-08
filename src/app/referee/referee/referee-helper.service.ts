import { Subscription } from 'rxjs';
import { ApiService } from './../../services/api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WallListRow } from 'src/app/entities/walllistrow';
import { NotificationService } from 'src/app/notification.service';
import { NotificationType } from 'src/app/entities/notification';
import { Tournament } from 'src/app/entities/tournament';

@Injectable({
  providedIn: 'root',
})
export class RefereeHelperService implements OnDestroy {
  private tournament: Tournament;
  private wallList: WallListRow[] = [];
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private api: ApiService
  ) {
    this.subscriptions.push(
      this.api.getTournamentInfo().subscribe((ti) => {
        const td = Object.values(ti) as unknown;
        const body = td[0] as Tournament;
        this.tournament = body;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  uploadResults(results: string): void {
    this.wallList = WallListRow.getWallTable(results);
    if (
      this.wallList.length > 0 &&
      this.wallList[0].round === this.tournament.finishedRoundNr + 1
    ) {
      this.uploadWallList();
    } else {
      const msg =
        this.translate.instant('WALL_LIST_ERROR') +
        String(this.tournament.finishedRoundNr + 1);
      this.notificationService.displayNotification(msg, NotificationType.error);
    }
  }

  uploadWallList(): void {
    let msg = '';
    this.subscriptions.push(
      this.api.addWallist(this.wallList).subscribe(
        () => {
          this.wallList = [];
          this.tournament.finishedRoundNr++;
          this.subscriptions.push(
            this.api.updateTournament(this.tournament).subscribe(
              () => {
                msg = this.translate.instant('ROUND_NUMBER_UPDATE_SUCCESS');
                this.notificationService.displayNotification(
                  msg,
                  NotificationType.success
                );
              },
              () => {
                msg = this.translate.instant('ROUND_NUMBER_UPDATE_FAILED');
                this.notificationService.displayNotification(
                  msg,
                  NotificationType.error
                );
              }
            )
          );
          msg = this.translate.instant('WALL_LIST_IMOPRT_SUCCESS');
          this.notificationService.displayNotification(
            msg,
            NotificationType.success
          );
        },
        () => {
          msg = this.translate.instant('WALL_LIST_IMOPRT_FAILED');
          this.notificationService.displayNotification(
            msg,
            NotificationType.error
          );
        }
      )
    );
  }
}
