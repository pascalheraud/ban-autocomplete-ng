import { Component, InputSignal, model, Optional, Pipe, PipeTransform } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  BanAutocompleteNgComponent,
  BanFeature,
  identityFunction,
  OptionalTranslatePipe,
} from 'ban-autocomplete-ng';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BanAutocompleteNgComponent, TranslateModule, OptionalTranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selection = model<BanFeature | undefined>();
  title = 'app';
  identity = identityFunction;
}
