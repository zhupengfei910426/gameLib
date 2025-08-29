import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/games';

@Component({
  selector: 'app-games',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];

  selectedPlatform: string = 'default';
  searchTerm: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get('assets/games.json').subscribe(data => {
      this.games = data as Game[];
      this.filteredGames = this.games;
    });
  }

  segmentChanged(event: any) {
    this.selectedPlatform = event.detail.value;
    this.onFilter();
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.searchTerm = query;
    this.onFilter();
  }

  handleClear() {
    this.searchTerm = '';
    this.onFilter();
  }

  onFilter() {
    this.filteredGames = this.games.filter(game => {
      const matchesPlatform = this.selectedPlatform === 'default' || game.platform.toLowerCase() === this.selectedPlatform;
      const matchesSearchTerm = !this.searchTerm || game.title.toLowerCase().includes(this.searchTerm) || game.english.toLowerCase().includes(this.searchTerm);
      return matchesPlatform && matchesSearchTerm;
    });
  }
}
