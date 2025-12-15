import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';

import { SettingsService, UnitSystem } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
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
    IonRadioGroup,
    IonRadio,
    IonButtons,
    IonBackButton,
  ],
})
export class SettingsPage {
  unitSystem: UnitSystem = 'metric';

  constructor(private settingsService: SettingsService) {}

  async ionViewWillEnter(): Promise<void> {
    this.unitSystem = await this.settingsService.getUnitSystem();
  }

  async onUnitChange(ev: CustomEvent): Promise<void> {
    const value = ev.detail.value as UnitSystem;
    this.unitSystem = value;
    await this.settingsService.setUnitSystem(value);
  }
}
