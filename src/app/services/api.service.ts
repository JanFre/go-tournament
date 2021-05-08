import { AuthService } from './../core/auth/auth.service';
import { WallListRow } from './../entities/walllistrow';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player, PlayerFromEGFDB } from '../entities/player';
import { Tournament } from '../entities/tournament';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getRefereeInfo() {
    const myHeaders = this.authService.addAuthHeader();
    return this.httpClient.get(`${environment.apiURL}:1337/secrets`, {
      headers: myHeaders,
    });
  }

  getPlayersFromEGFDB(namePrefix: string): Observable<PlayerFromEGFDB[]> {
    let params = new HttpParams();
    let np = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
    np = np.replace(/'/g, '`');
    params = params.append('namePrefix', np);
    const test = this.httpClient
      .get<PlayerFromEGFDB[]>(`${environment.apiURL}:8080/api/players`, {
        params,
      })
      .pipe(
        map((players) =>
          players.map((player) => new PlayerFromEGFDB().createNew(player))
        )
      );
    return test;
  }

  getTournamentInfo(): Observable<Tournament> {
    return this.httpClient.get<Tournament>(
      `${environment.apiURL}:1337/tournaments`
    );
  }

  getResults() {
    return this.httpClient.get(`${environment.apiURL}:1337/results`);
  }

  uploadResults(results) {
    const myHeaders = this.authService.addAuthHeader();
    return this.httpClient.post(`${environment.apiURL}:1337/results`, results, {
      headers: myHeaders,
    });
  }

  getPairings() {
    return this.httpClient.get(`${environment.apiURL}:1337/pairings`);
  }

  registerPlayer(p: Player) {
    let params = new HttpParams();
    Object.keys(p).forEach((key) => {
      params = params.append(key, p[key]);
    });
    const result = this.httpClient.post(
      `${environment.apiURL}:1337/players`,
      params
    );
    return result;
  }

  getPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${environment.apiURL}:1337/players`);
  }

  getPlayer(pin: number): Observable<Player[]> {
    return this.httpClient.get<Player[]>(
      `${environment.apiURL}:1337/players?pin=${pin}`
    );
  }

  addWallist(wL: WallListRow[]): Observable<boolean> {
    return new Observable((subscriber) => {
      forkJoin(wL.map((el) => this.addRow(el))).subscribe(
        () => subscriber.next(true),
        () => subscriber.next(false)
      );
    });
  }

  private addRow(row: WallListRow) {
    const myHeaders = this.authService.addAuthHeader();
    return this.httpClient.post(`${environment.apiURL}:1337/walllists`, row, {
      headers: myHeaders,
    });
  }

  getWallList(round: number) {
    return this.httpClient.get<WallListRow[]>(
      `${environment.apiURL}:1337/walllists?round=${round}`
    );
  }

  updateTournament(tournament: Tournament): Observable<Tournament> {
    const myHeaders = this.authService.addAuthHeader();
    return this.httpClient.put<Tournament>(
      `${environment.apiURL}:1337/tournaments/1`,
      tournament,
      { headers: myHeaders }
    );
  }
}
