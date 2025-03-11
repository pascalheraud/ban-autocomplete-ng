import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapBrowserTranslation } from 'ban-autocomplete-ng';

bootstrapApplication(AppComponent, appConfig)
  .then(bootstrapBrowserTranslation)
  .catch((err) => console.error(err));
