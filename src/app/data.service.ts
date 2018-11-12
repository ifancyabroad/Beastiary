import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  loading: boolean = false;
  currentMonsterList: Object[] = [];

  set monsterList(list) {
    this.currentMonsterList = list;
  }

  get monsterList() {
    return this.currentMonsterList;
  }

  constructor(private http: HttpClient) { }

  getMonsterList() {
  	return this.http.get('./assets/data/monsters.json/').pipe(
      map((data:Object[]) => {
        return data.map((monster) => {
          return { name: monster['name'], url: monster['url'] } 
        })
      })
    )
  }

  updateMonsterList(searchInput) {
    this.monsterList = [];
    this.loading = true;
    this.getMonsterList().subscribe(data => {
      let regex = new RegExp(searchInput.toLowerCase());
      let monsterList: Object[] = [];
      for (let monster of data) {
        if (regex.test(monster['name'].toLowerCase())) {
          monster['id'] = this.extractId(monster.url);
          monsterList.push(monster);
        }
      }
      this.monsterList = monsterList;
      this.loading = false;
    })
  }

  extractId(url) {
    let regex = /\d/g;
    return url.match(regex).slice(1).join("");
  }

  getMonsterDetails(id) {
    return this.http.get('./assets/data/monsters.json/').pipe(
      map((data:Object[]) => {
        return data[id - 1];
      })
    )
  }

}
