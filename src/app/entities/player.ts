import { Ratings } from './ratings';

export class Player {
  isEGF: boolean;
  firstName: string;
  lastName: string;
  rate: string;
  gor: number;
  rating: any;
  club: string;
  notes: string;
  pin: number;
  country: string;

  constructor() {
    this.isEGF = true;
    this.firstName = '';
    this.lastName = '';
    this.club = '';
    this.gor = Ratings.ratings[16].elo;
    this.rate = Ratings.ratings[16].name;
    this.notes = '';
    this.pin = 0;
    this.country = 'PL';
  }

  public static calculatePlayerPseudoPin(player: Player) {
    let pp = 400000000;
    for (let i = 0; i < player.firstName.length; i++) {
      pp += player.firstName.charCodeAt(i) * 11;
    }
    for (let i = 0; i < player.lastName.length; i++) {
      pp += player.lastName.charCodeAt(i) * 19;
    }
    for (let i = 0; i < player.club.length; i++) {
      pp += player.club.charCodeAt(i) * 23;
    }
    for (let i = 0; i < player.rate.length; i++) {
      pp += player.rate.charCodeAt(i);
    }
    return pp;
  }

  toFormValues() {
    return {
      rate: this.rate,
      firstName: this.firstName,
      lastName: this.lastName,
      gor: this.gor,
      club: this.club,
      isEGF: this.isEGF,
      notes: this.notes,
      pin: this.pin,
      country: this.country,
    };
  }
}

export class PlayerFromEGFDB {
  pin: number;
  name: string;
  grade: string;
  gor: number;
  club: string;
  fullString: string;

  constructor() {
    this.name = '';
    this.club = '';
    this.gor = Ratings.ratings[16].elo; // 2100;
    this.pin = 0;
    this.grade = '1d';
    this.fullString = '';
  }

  createNew(player: PlayerFromEGFDB) {
    this.name = player.name;
    this.club = player.club;
    this.gor = player.gor;
    this.pin = player.pin;
    this.grade = player.grade;
    return this;
  }

  toFormValues(
    fN: string,
    lN: string,
    egf: boolean,
    plPin: number,
    grade
  ): object {
    return {
      isEGF: egf,
      firstName: fN,
      lastName: lN,
      rate: grade,
      gor: this.gor,
      club: this.club,
      pin: plPin,
      country: this.club[0] + this.club[1],
    };
  }
}
