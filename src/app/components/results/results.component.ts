import { UtilsService } from 'src/app/services/utils.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ResList } from 'src/app/entities/reslist';
import { WallListRow } from 'src/app/entities/walllistrow';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'place',
    'name',
    'club',
    'level',
    'rating',
    'score',
    'rounds',
    'points',
    'scorex',
    'sos',
    'sosos',
  ];
  results: ResList[] = [];
  wallList: WallListRow[] = [];
  sortedData: WallListRow[];
  winList: number[] = [];
  loseList: number[] = [];
  selectedPlayer: number;

  private readonly subscriptions: Subscription[] = [];

  constructor(private api: ApiService, private utils: UtilsService) {}

  ngOnInit(): void {
    this.getResults();
    this.getLastRoundAndWallList();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  getResults(): void {
    // gets pdf files
    this.subscriptions.push(
      this.api.getResults().subscribe((results) => {
        const rl = Object.values(results);
        for (let i = 0; i < rl.length; i++) {
          this.results[i] = {
            desc: rl[i].Description,
            url: `${environment.apiURL}:1337${rl[i].List.url}`,
          };
        }
      })
    );
  }

  getWallList(lastRound: number): void {
    // gets table of results after the last played round
    this.subscriptions.push(
      this.api.getWallList(lastRound).subscribe((wl) => {
        for (const elem of wl) {
          if (elem.round === lastRound) {
            this.wallList.push(elem);
          }
        }
        this.sortedData = this.wallList.slice();
        this.sort.direction = 'asc';
        this.sort.active = 'place';
        this.sortData(this.sort);
      })
    );
  }

  getLastRoundAndWallList(): void {
    this.subscriptions.push(
      this.api.getTournamentInfo().subscribe((ti) => {
        const td = Object.values(ti);
        const fr = td[0].finishedRoundNr;
        this.getWallList(fr);
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.wallList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'place':
          return this.utils.compare(a.place, b.place, isAsc);
        case 'name':
          return this.utils.compare(a.name, b.name, isAsc);
        case 'club':
          return this.utils.compare(a.club, b.club, isAsc);
        case 'rating':
          return this.utils.compare(a.rating, b.rating, isAsc);
        default:
          return 0;
      }
    });
  }

  higlightOponents(row): void {
    this.winList = [];
    this.loseList = [];
    this.selectedPlayer = row.place;
    for (const elem of this.utils.winList(row.results)) {
      this.winList.push(elem);
    }
    for (const elem of this.utils.lossList(row.results)) {
      this.loseList.push(elem);
    }
  }

  checkWin(id: number): boolean {
    return this.winList.includes(id);
  }

  checkLose(id: number): boolean {
    return this.loseList.includes(id);
  }

  checkSelectedPlayer(id: number): boolean {
    return this.selectedPlayer === id;
  }

  clearTable(): void {
    this.winList = [];
    this.loseList = [];
    this.selectedPlayer = 0;
  }
}
