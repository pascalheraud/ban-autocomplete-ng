import { Component, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BanAutocompleteNgComponent,
  BanFeature,
  identityFunction,
} from 'ban-autocomplete-ng';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BanAutocompleteNgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selection = model<BanFeature | undefined>();
  title = 'app';
  identity = identityFunction;
}
