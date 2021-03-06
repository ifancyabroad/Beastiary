import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonsterDetailsComponent } from './monster-details/monster-details.component';
import { MonsterListComponent } from './monster-list/monster-list.component';
import { SearchHomeComponent } from './search-home/search-home.component';

const routes: Routes = [
  {
    path: '',
    component: SearchHomeComponent
  },
  {
    path: 'list',
    component: MonsterListComponent
  },
  {
    path: 'details/:id',
    component: MonsterDetailsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
