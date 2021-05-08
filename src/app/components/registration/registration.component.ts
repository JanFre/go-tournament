import { Ratings } from './../../entities/ratings';
import { Countries, Country } from './../../entities/countries';
import { Player } from './../../entities/player';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlayerFromEGFDB } from 'src/app/entities/player';
import { ApiService } from 'src/app/services/api.service';
import { filter, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/notification.service';
import { NotificationType } from 'src/app/entities/notification';
import { CommunicationService } from 'src/app/services/communication.service';
import latinize from 'latinize';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  ratings: { name: string; elo: number }[] = Ratings.ratings;
  playersForm: FormGroup;
  private player = new Player();
  isRegistrationClosed = false;
  selectedPlayers: PlayerFromEGFDB[] = [];
  playersToSelect = new FormControl();
  countryList: Country[] = Countries.selectedCountries;
  isEN = false;
  private subscription: Subscription;

  get isEGF(): boolean {
    return this.playersForm.get('isEGF').value;
  }

  constructor(
    private readonly api: ApiService,
    private readonly formBuilder: FormBuilder,
    private translate: TranslateService,
    private readonly notificationService: NotificationService,
    private readonly comSer: CommunicationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTournamentInfo();
    this.formListener();
    this.subscription = this.comSer.sharedData.subscribe((lang) => {
      this.isEN = lang === 'en';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm(): void {
    this.playersForm = this.formBuilder.group({
      isEGF: [this.player.isEGF],
      firstName: [this.player.firstName, [Validators.required]],
      lastName: [this.player.lastName, [Validators.required]],
      club: [this.player.club, [Validators.maxLength(45)]],
      notes: [this.player.notes, [Validators.maxLength(450)]],
      country: [this.player.country, [Validators.required]],
      gor: [this.player.gor, [Validators.required, Validators.min(1)]],
      rate: [this.player.rate, [Validators.required, Validators.maxLength(45)]],
      pin: [this.player.pin, [Validators.required]],
    });
  }

  private formListener(): void {
    this.playersToSelect.valueChanges
      .pipe(filter((el) => el.length > 2))
      .subscribe((x) => {
        const selectedPlayer = this.getPlayerFromString(x);
        if (this.selectedPlayers.length > 0 && selectedPlayer) {
          const newArr = x.split(' ');
          const pin = selectedPlayer.pin;
          const rate = selectedPlayer.grade;
          this.playersForm.patchValue(
            selectedPlayer.toFormValues(newArr[1], newArr[0], true, pin, rate)
          );
        } else {
          this.selectedPlayers = [];
          this.getPlayers();
        }
      });
  }

  private getPlayerFromString(player: string): PlayerFromEGFDB {
    return this.selectedPlayers.find((p) => {
      return player === `${p.name} ${p.grade} ${p.club} ${p.pin}`;
    });
  }

  getTournamentInfo(): void {
    this.api.getTournamentInfo().subscribe((info) => {
      this.isRegistrationClosed = info[0].registrationClosed;
    });
  }

  getPlayers(): void {
    const namePrefix = latinize(this.playersToSelect.value);
    this.api.getPlayersFromEGFDB(namePrefix).subscribe((players) => {
      this.selectedPlayers = players;
    });
  }

  registerPlayer(player: Player): void {
    this.api.getTournamentInfo().subscribe((info) => {
      this.isRegistrationClosed = info[0].registrationClosed;
      if (this.isRegistrationClosed) {
        return this.displayMessage(
          this.translate.instant('REGISTRATION_CLOSED'),
          NotificationType.error
        );
      }
      if (!player.isEGF) {
        player.pin = Player.calculatePlayerPseudoPin(player);
        player.gor = Ratings.getElo(player.rate);
      }
      this.api
        .getPlayer(player.pin)
        .pipe(finalize(() => this.clearPlayer()))
        .subscribe((plr) => {
          if (plr?.length) {
            return this.displayMessage(
              this.translate.instant('PLAYER_ALREADY_REGISTERED'),
              NotificationType.error
            );
          }
          this.api.registerPlayer(player).subscribe(
            () => {
              this.displayMessage(
                this.getPlayerMessage(player),
                NotificationType.success
              );
            },
            () => {
              this.displayMessage(
                this.translate.instant('PLAYER_REGISTRATION_ERROR'),
                NotificationType.error
              );
            }
          );
        });
    });
  }

  getPlayerMessage(player): string {
    return `${this.translate.instant('PLAYER')} ${player.firstName}
     ${player.lastName} ${this.translate.instant(
      'PLAYER_REGISTRATION_SUCCESS'
    )}`;
  }

  displayMessage(msg: string, type: NotificationType): void {
    this.notificationService.displayNotification(msg, type);
  }

  clearPlayer(): void {
    this.player = new Player();
    this.selectedPlayers = [];
    this.playersToSelect.patchValue('');
    this.player = new Player();
    this.playersForm.patchValue(this.player.toFormValues());
  }
}
