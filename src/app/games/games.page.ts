import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Game } from 'src/models/games';
import { BrowserStorageService } from 'src/services/storage.service';

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

  constructor(
    private httpClient: HttpClient,
    private storageService: BrowserStorageService
  ) {}

  ngOnInit() {
    const localStorageVersion = this.storageService.get('version');

    if (localStorageVersion) {
      this.httpClient.get('assets/version.json').pipe(
        tap((currentVersion: any) => {
          if (currentVersion.version === localStorageVersion) {
            this.games = JSON.parse(this.storageService.get('ordered-games') || '[]');
            this.filteredGames = this.games;
          } else {
            this.storeData();
          }
        })
      ).subscribe();
    } else {
      this.storeData();
    }
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
    this.filteredGames = JSON.parse(
      this.storageService.get(
        this.selectedPlatform === 'default' ? 'ordered-games' : `${this.selectedPlatform}-games`
      ) || '[]');

    this.filteredGames = this.filteredGames.filter(game => {
      const matchesSearchTerm = !this.searchTerm || game.title.toLowerCase().includes(this.searchTerm) || game.english.toLowerCase().includes(this.searchTerm);
      return matchesSearchTerm;
    });
  }

  storeData() {
    // store games data to local storage
    this.httpClient.get('assets/games.json').pipe(
      tap(data => {
        this.games = data as Game[];
        this.filteredGames = this.games;  // update current paged games immediately

        const orderedGames = this.games.sort((a, b) => a.english.localeCompare(b.english));
        this.storageService.set('ordered-games', JSON.stringify(orderedGames));

        const ps5Games = this.games.filter(game => game.platform.toLowerCase().includes('ps5'));
        this.storageService.set('ps5-games', JSON.stringify(ps5Games));

        const ps3Games = this.games.filter(game => game.platform.toLowerCase().includes('ps3'));
        this.storageService.set('ps3-games', JSON.stringify(ps3Games));

        const switchGames = this.games.filter(game => game.platform.toLowerCase().includes('switch'));
        this.storageService.set('switch-games', JSON.stringify(switchGames));

        const steamGames = this.games.filter(game => game.platform.toLowerCase().includes('steam'));
        this.storageService.set('steam-games', JSON.stringify(steamGames));

        const epicGames = this.games.filter(game => game.platform.toLowerCase().includes('epic'));
        this.storageService.set('epic-games', JSON.stringify(epicGames));
      })
    ).subscribe();

    this.storageService.setVersion();
  }
}
