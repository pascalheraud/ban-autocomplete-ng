import { ApplicationRef, importProvidersFrom } from '@angular/core';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export type languages =
  | 'en'
  | 'zh'
  | 'hi'
  | 'es'
  | 'fr'
  | 'ar'
  | 'bn'
  | 'pt'
  | 'ru'
  | 'ur'
  | 'id'
  | 'de'
  | 'ja'
  | 'sw'
  | 'tr'
  | 'it'
  | 'ta'
  | 'fa'
  | 'pl'
  | 'nl';

export const TRANSLATIONS = {
  en: {
    placeHolder: 'Type an address',
    notFound: 'No address found',
  },
  zh: {
    placeHolder: '输入地址',
    notFound: '未找到地址',
  },
  hi: {
    placeHolder: 'पता दर्ज करें',
    notFound: 'कोई पता नहीं मिला',
  },
  es: {
    placeHolder: 'Escribe una dirección',
    notFound: 'No se encontró la dirección',
  },
  fr: {
    placeHolder: 'Saisissez une adresse',
    notFound: 'Aucune adresse trouvée',
  },
  ar: {
    placeHolder: 'اكتب عنوانًا',
    notFound: 'لم يتم العثور على عنوان',
  },
  bn: {
    placeHolder: 'একটি ঠিকানা টাইপ করুন',
    notFound: 'কোনো ঠিকানা পাওয়া যায়নি',
  },
  pt: {
    placeHolder: 'Digite um endereço',
    notFound: 'Nenhum endereço encontrado',
  },
  ru: {
    placeHolder: 'Введите адрес',
    notFound: 'Адрес не найден',
  },
  ur: {
    placeHolder: 'ایک پتہ درج کریں',
    notFound: 'کوئی پتہ نہیں ملا',
  },
  id: {
    placeHolder: 'Ketik alamat',
    notFound: 'Alamat tidak ditemukan',
  },
  de: {
    placeHolder: 'Geben Sie eine Adresse ein',
    notFound: 'Keine Adresse gefunden',
  },
  ja: {
    placeHolder: '住所を入力してください',
    notFound: '住所が見つかりませんでした',
  },
  sw: {
    placeHolder: 'Andika anwani',
    notFound: 'Hakuna anwani iliyopatikana',
  },
  tr: {
    placeHolder: 'Bir adres yazın',
    notFound: 'Adres bulunamadı',
  },
  it: {
    placeHolder: 'Digita un indirizzo',
    notFound: 'Nessun indirizzo trovato',
  },
  ta: {
    placeHolder: 'முகவரி টাইப் செய்க',
    notFound: 'முகவரி கிடைக்கவில்லை',
  },
  fa: {
    placeHolder: 'یک آدرس تایپ کنید',
    notFound: 'آدرسی پیدا نشد',
  },
  pl: {
    placeHolder: 'Wpisz adres',
    notFound: 'Nie znaleziono adresu',
  },
  nl: {
    placeHolder: 'Typ een adres',
    notFound: 'Geen adres gevonden',
  },
};

export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: languages): Observable<any> {
    return of(TRANSLATIONS[lang] || TRANSLATIONS['en']); // Fallback in english
  }
}

export const BanAutocompleteNGTranslateProvider = importProvidersFrom(
  TranslateModule.forRoot({
    loader: { provide: TranslateLoader, useClass: CustomTranslateLoader },
  })
);

export function bootstrapBrowserTranslation(appRef: ApplicationRef) {
  const translate = appRef.injector.get(TranslateService);
  const browserLang = navigator.language.split('-')[0]; // Ex: "fr-FR" becomes "fr"
  translate.setDefaultLang('en');
  translate.use(browserLang in TRANSLATIONS ? browserLang : 'en');
}
