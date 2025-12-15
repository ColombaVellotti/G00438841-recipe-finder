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
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  IonThumbnail,
  IonImg,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { RecipeService } from '../services/recipe.service';
import { FavouritesService, FavouriteRecipe } from '../services/favourites.service';

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
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
    IonThumbnail,
    IonImg,
  ],
})
export class RecipeDetailsPage {
  recipeId: string | null = null;

  recipe: any = null;
  ingredients: any[] = [];

  // NEW
  steps: string[] = [];

  errorMsg: string = '';

  isFavourite: boolean = false;

  private readonly ING_IMG_BASE = 'https://spoonacular.com/cdn/ingredients_100x100/';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private favouritesService: FavouritesService
  ) {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    this.recipeId = this.route.snapshot.queryParamMap.get('id');
    console.log('DETAILS PAGE recipeId =', this.recipeId);

    if (!this.recipeId) {
      this.errorMsg = 'No recipe id was provided in the URL.';
      return;
    }

    // Favourite status
    this.isFavourite = await this.favouritesService.isFavourite(Number(this.recipeId));

    try {
      // 1) load recipe info
      this.recipe = await this.recipeService.getRecipeDetails(this.recipeId);
      console.log('DETAILS PAGE recipe =', this.recipe);

      // favourite status again after load
      this.isFavourite = await this.favouritesService.isFavourite(Number(this.recipeId));

      // 2) ingredients: prefer extendedIngredients
      if (this.recipe?.extendedIngredients?.length) {
        this.ingredients = this.recipe.extendedIngredients;
      } else {
        // fallback: ingredient widget endpoint
        const widgetResp = await this.recipeService.getRecipeIngredientsWidget(this.recipeId);
        console.log('WIDGET RESPONSE STATUS =', widgetResp.status);
        console.log('WIDGET RESPONSE DATA =', widgetResp.data);

        if (widgetResp.status !== 200) {
          this.errorMsg = 'Ingredient widget error: ' + JSON.stringify(widgetResp.data);
          this.ingredients = [];
          return;
        }

        this.ingredients = widgetResp.data?.ingredients ?? [];
      }

      // 3) instructions: prefer analyzedInstructions (step-by-step)
      this.steps = this.extractSteps(this.recipe);
    } catch (err: any) {
      console.log('DETAILS PAGE error =', err);
      this.errorMsg = 'Failed to load recipe details or ingredients. Check console.';
    }
  }

  async toggleFavourite(): Promise<void> {
    if (!this.recipeId) return;

    const fav: FavouriteRecipe = {
      id: Number(this.recipeId),
      title: this.recipe?.title ?? `Recipe ${this.recipeId}`,
      image: this.recipe?.image,
    };

    this.isFavourite = await this.favouritesService.toggleFavourite(fav);
  }

  // -------- Helpers for ingredient images + instructions --------

  getIngredientImageUrl(ing: any): string {
    // If Spoonacular gives a filename like "carrot.png"
    const img = ing?.image;
    if (typeof img === 'string' && img.trim().length > 0) {
      return this.ING_IMG_BASE + img.trim();
    }
    return '';
  }

  getIngredientLine(ing: any): string {
    // extendedIngredients usually has "original"
    if (ing?.original) return ing.original;

    // widget ingredients sometimes have name + amount.metric
    const value = ing?.amount?.metric?.value;
    const unit = ing?.amount?.metric?.unit;
    const name = ing?.name;

    if (value != null && unit && name) return `${value} ${unit} ${name}`;
    if (name) return `${name}`;

    return JSON.stringify(ing);
  }

  private extractSteps(recipe: any): string[] {
    // Best: analyzedInstructions[0].steps[].step
    const analyzed = recipe?.analyzedInstructions;
    if (Array.isArray(analyzed) && analyzed.length > 0) {
      const first = analyzed[0];
      if (Array.isArray(first?.steps) && first.steps.length > 0) {
        return first.steps
          .map((s: any) => s?.step)
          .filter((s: any) => typeof s === 'string' && s.trim().length > 0);
      }
    }

    // Fallback: some recipes have "instructions" as a string (often HTML)
    // We’ll display it as one “step” if we have nothing else.
    const instr = recipe?.instructions;
    if (typeof instr === 'string' && instr.trim().length > 0) {
      // strip simple HTML tags (basic)
      const text = instr.replace(/<\/?[^>]+(>|$)/g, '').trim();
      if (text.length > 0) return [text];
    }

    return [];
  }
}
