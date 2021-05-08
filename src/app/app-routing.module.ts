import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ParticipantsComponent } from './components/participants/participants.component';
import { PairingComponent } from './components/pairing/pairing.component';
import { ResultsComponent } from './components/results/results.component';
import { VenueComponent } from './components/venue/venue.component';
import { CommonModule } from '@angular/common';
import { RefereeComponent } from './referee/referee/referee.component';
import { RefereeGuard } from './referee/referee/referee.guard';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'participants', component: ParticipantsComponent},
  {path: 'pairing', component: PairingComponent},
  {path: 'results', component: ResultsComponent},
  {path: 'venue', component: VenueComponent},
  {path: 'login', component: LoginComponent},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'referee', component: RefereeComponent, canLoad: [RefereeGuard], canActivate: [RefereeGuard],
     loadChildren: () => import('./referee/referee.module').then(m => m.RefereeModule)}
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
