import { Token, User } from './../../entities/auth';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  helper: JwtHelperService;
  private subscription: Subscription;
  private referees: number[] = [1, 4];

  constructor(private httpClient: HttpClient, private route: Router) {
    this.helper = new JwtHelperService();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // indexes of referees in my Strapi db:

  addAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  isReferee(): boolean {
    const tokenContent = this.helper.decodeToken(this.getToken()); // Strapi token is valid for 30 days
    return this.referees.includes(tokenContent?.id);
  }

  login(login: string, password: string): Observable<string> {
    return new Observable((subscriber: Subscriber<string>) => {
      this.subscription = this.authorise(login, password).subscribe(
        (tokenPlus) => {
          this.storeUserData(tokenPlus);
          this.route.navigate(['/referee']);
          subscriber.next('ok');
          subscriber.complete();
        },
        () => {
          subscriber.error('Login failed');
          subscriber.complete();
        }
      );
    });
  }

  private storeUserData(token: Token): void {
    const user: User = Object.values(token)[1];
    localStorage.setItem('jwt', Object.values(token)[0]);
    localStorage.setItem('username', user.username);
    localStorage.setItem('usermail', user.email);
  }

  getToken(): string {
    return localStorage.getItem('jwt');
  }

  authorise(login: string, pass: string): Observable<Token> {
    return this.httpClient.post<Token>(
      `${environment.apiURL}:1337/auth/local`,
      { identifier: login, password: pass }
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('usermail');
    this.route.navigate(['/login']);
  }
}
