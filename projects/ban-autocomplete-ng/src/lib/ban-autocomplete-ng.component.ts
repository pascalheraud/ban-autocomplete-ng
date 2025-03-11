import {
  ApplicationRef,
  Component,
  inject,
  input,
  InputFunction,
  InputSignal,
  model,
  Optional,
  Pipe,
  PipeTransform,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

interface Ban {
  features: BanFeature[];
}

export interface BanFeature { // See BAN for details
  label: string; // The full address label used for the item
  wktPoint?: string; // The geo point in WKT format : POINT(5 45)
  properties?: {
    label: string; // The full address label coming from BAN
    city: string; // The city name
    citycode: string; // The city INSEE code
    id: string; // A unique id of the address
    type: string; // The type of adresse (municipality, street)
    population: number; // The population of the city
    context: string; // The label of the place containing the point
    municipality: string; // The name of the municipality if type is "municipality"
    street: string; // The name of the street if type is "street"
    postcode: string; // The postcode of the address
  };
  geometry: {
    coordinates: [number, number]; // Coordinates : longitude, latitude
  };
}

export function identityFunction(item: BanFeature): BanFeature {
  return item;
}

export { BanAutocompleteNGTranslateProvider } from './ban-autocomplete-ng-i18n';
export { bootstrapBrowserTranslation } from './ban-autocomplete-ng-i18n';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'optionalTranslate',
  pure: false,
})
export class OptionalTranslatePipe implements PipeTransform {
  translateService: TranslateService | null | undefined;

  constructor() {
    try {
      this.translateService = inject(TranslateService, { optional: true });
    } catch (e) {
      console.warn('No translation service found. Will use default labels.');
    }
  }

  transform(
    key: string,
    input: InputSignal<string | undefined> | undefined,
    defaultLabel: string
  ): string {
    if (input && input()) {
      return input()!;
    }
    if (this.translateService) {
      const translated = this.translateService.instant(key);
      if (translated !== key) {
        return translated;
      }
    }
    return defaultLabel;
  }
}

@Component({
  selector: 'ban-autocomplete-ng',
  imports: [AutocompleteLibModule, TranslateModule, OptionalTranslatePipe],
  template: `
    <div class="ng-autocomplete">
      <ng-autocomplete
        [data]="data"
        [placeholder]="
          'placeHolder'
            | optionalTranslate : placeHolderLabel : 'Saisisez une adresse'
        "
        (inputChanged)="onChangeSearch($event, false)"
        [minQueryLength]="minCharacters()"
        [searchKeyword]="'label'"
        [itemTemplate]="itemTemplate() ? itemTemplate()! : defaultItemTemplate"
        [notFoundTemplate]="
          notFoundTemplate() ? notFoundTemplate()! : defaultNotFoundTemplate
        "
        [customFilter]="customFilter"
        (selected)="selected($event)"
      >
        >
      </ng-autocomplete>
      <ng-template #defaultItemTemplate let-item>
        <a>{{ item.properties.label }}</a>
      </ng-template>

      <ng-template #defaultNotFoundTemplate let-notFound>
        <div>
          {{
            'notFound'
              | optionalTranslate : notFoundLabel : 'Aucune adresse trouvée'
          }}
        </div>
      </ng-template>
    </div>
  `,
})
export class BanAutocompleteNgComponent {
  data: BanFeature[] = [];
  maxResults = input<number>(7);
  minCharacters = input<number>(3);
  notFoundTemplate = input<TemplateRef<BanFeature>>();
  itemTemplate = input<TemplateRef<BanFeature>>();
  placeHolderLabel = input<string>();
  notFoundLabel = input<string>();

  selection = model<BanFeature | undefined>();
  translationService: TranslateService | undefined;

  constructor(applicationRef: ApplicationRef) {
    try {
      this.translationService = inject(TranslateService);
      console.log('Instant=', this.translationService.instant('placeHolder'));
    } catch (e) {
      console.warn('No translation service found. Will use default labels.');
    }
  }

  translateIt(
    key: string,
    input: InputSignal<string | undefined>,
    defaultLabel: string
  ) {
    return key + defaultLabel;
  }
  selected(event: BanFeature) {
    this.selection.set(event);
  }

  customFilter(items: BanFeature[], query: string) {
    return items;
  }

  onChangeSearch(query: string, updateModel: boolean) {
    if (!query) {
      return;
    }
    const banRequest = new Request(
      'https://api-adresse.data.gouv.fr/search/?q=' +
        query +
        '&limit=' +
        (this.maxResults() || 7)
    );
    fetch(banRequest)
      .then((response) => {
        return response.json();
      })
      .then((json: Ban) => {
        if (json.features.length === 0) {
          this.data = [];
          return;
        }
        const data = json.features;
        data.forEach((feature) => {
          feature.label = feature.properties!.label;
          feature.wktPoint =
            'POINT(' +
            feature.geometry!.coordinates[0] +
            ' ' +
            feature.geometry!.coordinates[1] +
            ')';
        });
        this.data = data;
      });
  }
}
