# BanAutocompleteNg

A simple Angular component to provide an autocomplete field for French ban ( https://api-adresse.data.gouv.fr/search/?q=Grenoble&limit=7 )

Thanks to https://www.npmjs.com/package/angular-ng-autocomplete for autocompletion.

## Installation

```sh
npm install --save ban-autocomplete-ng
```

## Usage

```html
<ban-autocomplete-ng [(selection)]="searchAddress" [maxResults]="3" [minCharacters]= />
```

## Typing
selection is typed using the BanFeature interface : 
```typescript
interface BanFeature { // See BAN for details
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
```


## Using i18n

If you want labels to be translated using browser lang. You have to configure @ngx/translate in your application. First change the main.ts file to include bootstrapBrowserTranslation:

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { bootstrapBrowserTranslation } from "ban-autocomplete-ng";

bootstrapApplication(AppComponent, appConfig)
  .then(bootstrapBrowserTranslation)
  .catch((err) => console.error(err));
```

Then change main app.config.ts to export the module :

```typescript
import { Component, model } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { BanAutocompleteNgComponent, BanFeature, identityFunction } from "ban-autocomplete-ng";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, BanAutocompleteNgComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  selection = model<BanFeature | undefined>();
  title = "app";
  identity = identityFunction;
}
```

## Customizing templates
You can change the item template by using ng-template :

```html
 <ban-autocomplete-ng
      [itemTemplate]="itemTemplate"
      [notFoundTemplate]="notFoundTemplate"
    ></ban-autocomplete-ng>
  </div>
  <ng-template #itemTemplate let-untypedItem>
    @let item = identity(untypedItem);
    <div class="item">
      <div>{{ item.properties?.postcode }} {{ item.properties?.city }}</div>
    </div>
  </ng-template>
  <ng-template #notFoundTemplate let-untypedItem>
    @let item = identity(untypedItem); Votre recherche n'aboutit à aucune adresse
    {{ item }}
  </ng-template>
```
You can use 
 the "identity" function to type the template with BanFeature.

## Example
See example applications in projects/app/ and projects/app-no-i18n folders on github

## Reference
| Attribute | Description |
| ----------| ------------|
| [(selection)] | optional model for getting the selection|
| [maxResults] | optional number for the maximum results to display. Default is 7|
| [minCharacters] | optional number for the minimum of characters to type to trigger completion. Default is 3|
| [notFoundTemplate] | an optional id string to a ng-template that will be used to render the "not found"|
| [itemTemplate] | an optional id string to a ng-template that will be used to render each result|
| [placeHolderLabel] | an optional string that will be used to render the place holder. If not found, translation is used if available. If no translation available, a defaut french text is provided|
| [notFoundLabel] | an optional string that will be used to render the place holder. If not found, translation is used if available. If no translation available, a defaut french text is provided|