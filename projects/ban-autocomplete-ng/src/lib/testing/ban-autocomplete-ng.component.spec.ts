import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanAutocompleteNgComponent } from '../ban-autocomplete-ng.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import gre from './ban-autocomplete-ng.component.data';

const fetch = vi.fn();
global.fetch = fetch;

function createFetchResponse(data: any) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}
describe('BanAutocompleteNgComponent', () => {
  let component: BanAutocompleteNgComponent;
  let fixture: ComponentFixture<BanAutocompleteNgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BanAutocompleteNgComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(BanAutocompleteNgComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', async () => {
    // Arrange : Mock fetch response
    fetch.mockResolvedValue(createFetchResponse(gre));

    // Assert : Snap empty state
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.outerHTML).toMatchSnapshot('empty');

    // Act: Type "Gre" and fire update events
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'Gre';
    input.nativeElement.dispatchEvent(
      new Event('input', {
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
    input.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'G',
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
    input.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'G',
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );

    // Assert : wait for suggestions to be visible and snap them
    const suggestions = await vi.waitUntil(() =>
      fixture.debugElement.query(By.css('#suggestions.is-visible'))
    );
    expect(fixture.nativeElement.outerHTML).toMatchSnapshot('suggests');

    // Act : Click on the first suggestion
    const li = suggestions.query(By.css('li:nth-child(1) div'));
    li.nativeElement.click();

    // Assert : wait for input to be set to "Grenoble" and snap the result
    await vi.waitUntil(() => input.nativeElement.value == 'Grenoble');
    expect(fixture.nativeElement.outerHTML).toMatchSnapshot('clicked');
  });
});
