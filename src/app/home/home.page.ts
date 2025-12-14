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

import { RecipeService } from '../services/recipe.service';

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

  constructor(private router: Router, private recipeService: RecipeService) {
    addIcons({ heart, settingsOutline });
  }

  async searchRecipes() {
    this.recipes = await this.recipeService.searchByIngredients(this.searchText);
  }

  openRecipeDetails(recipe: any) {
  this.router.navigateByUrl('/recipe-details?id=' + recipe.id);
  }

  goToFavourites() {
    this.router.navigateByUrl('/favourites');
  }

  goToSettings() {
    this.router.navigateByUrl('/settings');
  }
}
