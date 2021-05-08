import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss']
})
export class PairingComponent implements OnDestroy {

  pairings = [];
  private subscription: Subscription;

  constructor(private api: ApiService) {
    this.getPairings();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPairings() {
    this.subscription = this.api.getPairings().subscribe((pairings) => {
      const pairingsList = Object.values(pairings);
      for (let i = 0; i < pairingsList.length; i++) {
        this.pairings[i] = {desc: pairingsList[i].Description, url: `${environment.apiURL}:1337${pairingsList[i].Pairing.url}`};
      }
    });
  }

}
