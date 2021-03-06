import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { faSearch, faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @ViewChild('searchForm') searchForm: NgForm;
  @Input() class: string;

  fullMonsterList: Object[] = [];
  currentMonsterList: Object[] = [];

  selectedMonster = -1;
  showList = true;
  searchInput: string;

  faSearch = faSearch;
  faDiceD20 = faDiceD20;

  constructor(public data: DataService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.data.getMonsterList().subscribe(data => {
      const monsterNames = this.data.getMonsterNames(data);
      for (let monster of monsterNames) {
        monster['id'] = this.data.extractId(monster.url);
        this.fullMonsterList.push(monster);
      }
    });
  }

  resetForm() {
    this.searchInput = '';
    this.showList = false;
  }

  setInput(name) {
    this.searchInput = name;
    this.showList = false;
  }

  stopSubmit(e) {
    if (this.selectedMonster > -1) {
      e.preventDefault();
    }
  }

  splitMonsterName(regex, name) {
    const parts = name.replace(regex, '*').split('*');
    const first = parts[0];
    const last = parts[1];
    const middle = name.match(regex)[0];
    return [first, middle, last];
  }

  filterMonsters() {
    if (this.searchInput) {
      const regex = new RegExp(this.searchInput, 'i');
      this.currentMonsterList = this.fullMonsterList
      .filter(monster => regex.test(monster['name'].toLowerCase()))
      .map(monster => {
        const splitName = this.splitMonsterName(regex, monster['name']);
        monster['first'] = splitName[0];
        monster['middle'] = splitName[1];
        monster['last'] = splitName[2];
        return monster;
      });
      this.showList = true;
    }
  }

  selectMonster(e) {
    if (this.currentMonsterList) {
      if (e.keyCode === 13 && this.selectedMonster > -1) {
        this.setInput(this.currentMonsterList[this.selectedMonster]['name']);
        this.selectedMonster = -1;
      } else if (e.keyCode === 38 && this.selectedMonster > 0) {
        this.selectedMonster--;
      } else if (e.keyCode === 40 && this.currentMonsterList.length > this.selectedMonster + 1) {
        this.selectedMonster++;
      }
    }
  }

  searchMonsters() {
    this.filterMonsters();
    if (this.currentMonsterList.length !== 1) {
      this.data.updateMonsterList(this.searchInput);
      this.router.navigate(['/list', { search: this.searchInput }]);
    } else {
      this.router.navigate([`/details/${this.currentMonsterList[0]['id']}`]);
    }
    this.resetForm();
  }

  searchRandomMonster() {
    this.data.getMonsterList().subscribe(data => {
      let max = data.length;
      let monsterId = Math.floor(Math.random() * (max - 1) + 1);
      this.router.navigate([`/details/${monsterId}`]);
    });
  }
}
