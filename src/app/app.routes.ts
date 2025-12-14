import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'recipe-details',
    loadComponent: () =>
      import('./recipe-details/recipe-details.page').then(
        (m) => m.RecipeDetailsPage
      ),
  },

  {
    path: 'favourites',
    loadComponent: () =>
      import('./favourites/favourites.page').then((m) => m.FavouritesPage),
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.page').then((m) => m.SettingsPage),
  },
];
