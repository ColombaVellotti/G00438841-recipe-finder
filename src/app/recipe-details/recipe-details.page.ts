import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RecipeDetailsPage implements OnInit {
  recipeId: string | null = null;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
  this.recipeId = this.route.snapshot.queryParamMap.get('id');
}


}
