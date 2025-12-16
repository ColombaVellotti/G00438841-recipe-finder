import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { FavouritesService, FavouriteRecipe } from '../services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonImg,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
  ],
})
export class FavouritesPage {
  favourites: FavouriteRecipe[] = [];

  constructor(private favouritesService: FavouritesService) {
    addIcons({ trashOutline });
  }

  // Runs every time you enter this page (so list refreshes)
  async ionViewWillEnter(): Promise<void> {
    this.favourites = await this.favouritesService.getFavourites();
  }

  async remove(recipeId: number): Promise<void> {
    await this.favouritesService.removeFavourite(recipeId);
    this.favourites = await this.favouritesService.getFavourites();
  }

  trackById(_: number, item: FavouriteRecipe): number {
    return item.id;
  }
}
