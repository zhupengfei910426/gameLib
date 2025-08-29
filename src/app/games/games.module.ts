import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesPage } from './games.page';

import { GamesPageRoutingModule } from './games-routing.module';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GamesPageRoutingModule
  ],
  declarations: [GamesPage],
  providers: [provideHttpClient()]
})
export class GamesPageModule {}
