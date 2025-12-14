import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { heartOutline, settingsOutline } from 'ionicons/icons';

import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

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
  ],
})
export class HomePage {
  searchText: string = '';
  recipes: any[] = [];

  constructor(private router: Router, private recipeService: RecipeService) {
    addIcons({ heartOutline, settingsOutline });
  }

  async searchRecipes() {
    this.recipes = [];

    const query = (this.searchText || '').trim();
    if (!query) return;

    try {
      const resp: any = await this.recipeService.searchByIngredients(query);
      console.log('HOME: searchByIngredients response =', resp);

      if (Array.isArray(resp)) this.recipes = resp;
      else if (Array.isArray(resp?.data)) this.recipes = resp.data;
      else if (Array.isArray(resp?.results)) this.recipes = resp.results;
      else this.recipes = [];

      console.log('HOME: recipes array length =', this.recipes.length);
    } catch (err) {
      console.log('HOME: searchRecipes error =', err);
      this.recipes = [];
    }
  }

  openRecipeDetails(recipe: any) {
    this.router.navigateByUrl('/recipe-details?id=' + recipe.id);
  }

  goToSettings() {
    this.router.navigateByUrl('/settings');
  }
}
