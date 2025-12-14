import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class RecipeDetailsPage {
  recipeId: string | null = null;

  recipe: any = null;
  ingredients: any[] = [];

  errorMsg: string = '';
  debugMsg: string = '';

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {}

  async ngOnInit() {
    this.recipeId = this.route.snapshot.queryParamMap.get('id');
    console.log('DETAILS PAGE recipeId =', this.recipeId);

    if (!this.recipeId) {
      this.errorMsg = 'No recipe id was provided in the URL.';
      return;
    }

    try {
      // 1) load recipe info
      this.recipe = await this.recipeService.getRecipeDetails(this.recipeId);
      console.log('DETAILS PAGE recipe =', this.recipe);

      // 2) try extendedIngredients first (if present)
      if (this.recipe?.extendedIngredients?.length) {
        this.ingredients = this.recipe.extendedIngredients;
        this.debugMsg = 'Ingredients from recipe.extendedIngredients';
        return;
      }

      // 3) fallback: ingredient widget endpoint (more reliable)
      const widgetResp = await this.recipeService.getRecipeIngredientsWidget(this.recipeId);
      console.log('WIDGET RESPONSE STATUS =', widgetResp.status);
      console.log('WIDGET RESPONSE DATA =', widgetResp.data);

      if (widgetResp.status !== 200) {
        this.errorMsg = 'Ingredient widget error: ' + JSON.stringify(widgetResp.data);
        this.ingredients = [];
        return;
      }

      this.ingredients = widgetResp.data?.ingredients ?? [];
      this.debugMsg = 'Ingredients from ingredientWidget.json';

      if (!this.ingredients.length) {
        this.debugMsg += ' (but array was empty) -> ' + JSON.stringify(widgetResp.data);
      }
    } catch (err: any) {
      console.log('DETAILS PAGE error =', err);
      this.errorMsg = 'Failed to load recipe details or ingredients. Check console.';
    }
  }
}
