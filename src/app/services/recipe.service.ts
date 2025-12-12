import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // TODO: paste your Spoonacular API key here
  private apiKey: string = 'PASTE_YOUR_API_KEY_HERE';

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
}
