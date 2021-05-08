import { UtilsService } from 'src/app/services/utils.service';
import { Player} from './../../entities/player';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnDestroy {

  registeredPlayers: Player[] = [];
  sortedData: Player[];
  private subscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['firstName', 'lastName', 'club', 'rate', 'gor'];

  constructor(private api: ApiService, private utils: UtilsService) {
    this.getPlayers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getPlayers() {
    this.subscription = this.api.getPlayers().subscribe((players) => {
      this.registeredPlayers = players;
      this.sortedData = this.registeredPlayers.slice();
      this.sort.direction = 'desc';
      this.sort.active = 'gor';
      this.sortData(this.sort);
    });
  }

  sortData(sort: Sort): number {
    const data = this.registeredPlayers.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lastName': return this.utils.compare(a.lastName, b.lastName, isAsc);
        case 'firstName': return this.utils.compare(a.firstName, b.firstName, isAsc);
        case 'club': return this.utils.compare(a.club, b.club, isAsc);
        case 'gor': return this.utils.compare(a.gor, b.gor, isAsc);
        default: return 0;
      }
    });
  }

}
