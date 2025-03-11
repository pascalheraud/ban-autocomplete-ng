import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BanAutocompleteNGTranslateProvider } from 'ban-autocomplete-ng';

import { routes } from './app.routes';
import { TranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    BanAutocompleteNGTranslateProvider,
  ],
};
