import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface FavouriteRecipe {
  id: number;
  title: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private storageReady = false;
  private readonly KEY = 'favourites';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
    this.storageReady = true;
  }

  private async ensureReady(): Promise<void> {
    if (!this.storageReady) {
      await this.init();
    }
  }

  private async readAll(): Promise<FavouriteRecipe[]> {
    await this.ensureReady();
    const data = await this.storage.get(this.KEY);
    if (Array.isArray(data)) return data as FavouriteRecipe[];
    return [];
  }

  private async writeAll(favs: FavouriteRecipe[]): Promise<void> {
    await this.ensureReady();
    await this.storage.set(this.KEY, favs);
  }

  async getFavourites(): Promise<FavouriteRecipe[]> {
    return await this.readAll();
  }

  async isFavourite(recipeId: number): Promise<boolean> {
    const favs = await this.readAll();
    return favs.some(r => r.id === recipeId);
  }

  async addFavourite(recipe: FavouriteRecipe): Promise<void> {
    const favs = await this.readAll();
    const exists = favs.some(r => r.id === recipe.id);
    if (!exists) {
      favs.unshift(recipe);
      await this.writeAll(favs);
    }
  }

  async removeFavourite(recipeId: number): Promise<void> {
    const favs = await this.readAll();
    const updated = favs.filter(r => r.id !== recipeId);
    await this.writeAll(updated);
  }

  async toggleFavourite(recipe: FavouriteRecipe): Promise<boolean> {
    const favs = await this.readAll();
    const exists = favs.some(r => r.id === recipe.id);

    if (exists) {
      await this.removeFavourite(recipe.id);
      return false;
    } else {
      await this.addFavourite(recipe);
      return true;
    }
  }

  async clearAll(): Promise<void> {
    await this.ensureReady();
    await this.storage.remove(this.KEY);
  }
}
