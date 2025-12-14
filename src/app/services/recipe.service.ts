import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // TODO 
  private apiKey: string = '70759a4f7911402abcc53d3c51d3b759';

  constructor() {}

  async searchByIngredients(ingredients: string): Promise<any[]> {
    const trimmed = ingredients.trim();
    if (!trimmed) return [];

    const response = await CapacitorHttp.get({
      url: 'https://api.spoonacular.com/recipes/findByIngredients',
      params: {
        ingredients: trimmed,
        number: '10',
        apiKey: this.apiKey,
      },
    });

    return (response.data as any[]) ?? [];
  }

  async getRecipeDetails(id: string): Promise<any> {
    const response = await CapacitorHttp.get({
      url: `https://api.spoonacular.com/recipes/${id}/information`,
      params: {
        includeNutrition: 'false',
        apiKey: this.apiKey,
      },
    });

    return response.data;
  }

  // return full response so we can see status + error payload if any
  async getRecipeIngredientsWidget(id: string): Promise<{ status: number; data: any }> {
    return await CapacitorHttp.get({
      url: `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json`,
      params: { apiKey: this.apiKey },
    });
  }
}
