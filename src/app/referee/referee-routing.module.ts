import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefereeComponent } from './referee/referee.component';

const routes: Routes = [
  {path: '', component: RefereeComponent}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RefereeRoutingModule { }
