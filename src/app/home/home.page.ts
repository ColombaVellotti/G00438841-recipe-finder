import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { heart, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage {
  searchText: string = '';
  recipes: any[] = [];

  constructor(private router: Router) {
    addIcons({ heart, settingsOutline });
  }

  searchRecipes() {
    console.log('Searching for:', this.searchText);
  }

  openRecipeDetails(recipe: any) {
    console.log('Open recipe details for:', recipe);
  }

  goToFavourites() {
    this.router.navigateByUrl('/favourites');
  }

  goToSettings() {
    this.router.navigateByUrl('/settings');
  }
}
