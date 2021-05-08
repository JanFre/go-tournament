import { RefereeRoutingModule } from './referee-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefereeComponent } from './referee/referee.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [RefereeComponent, RefereeComponent],
  imports: [
    CommonModule,
    RefereeRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatButtonToggleModule
  ]
})
export class RefereeModule { }
