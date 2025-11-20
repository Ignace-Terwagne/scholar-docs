---
id: wf-theo-3
title: 3. Componentcommunicatie, Routing, Reactive Forms en Pipes
sidebar_label:  3. Componentcommunicatie, Routing, Reactive Forms en Pipes
---

## 1. Componentcommunicatie
:::note
We hebben dit onderwerp in les 2 al kort bekeken. Hier herhalen we het nog even om alles goed op te frissen.
:::

Zoals we eerder al hebben gezien zijn Angular-apps volledig opgebouwd uit componenten die hiërarchisch georganiseerd zijn. Componenten moeten vaak gegevens uitwisselen: van parent naar child, van child naar parent of zelfs in beide richtingen. Angular biedt hiervoor `@Input`, `@Output` en two-way binding.

Door deze mechanismen blijft de component hiërarchie losjes gekoppeld, wat onderhoud en herbruikbaarheid bevordert.

### Data van parent naar child: `@Input`
Met `@Input()` kan een parentcomponent data doorgeven aan een childcomponent. De parent stuurt een waarde, het child ontvangt deze en kan deze in zijn template gebruiken.

```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';
import { Profiel } from '../profiel/profiel';

@Component({
  selector: 'app-kaart',
  imports: [Profiel],
  templateUrl: './kaart.html',
  styleUrl: './kaart.css',
})

export class Kaart {
  gebruiker = "John";
}
```
```html
<!-- src/app/kaart/kaart.html -->
<h2>Kaart component</h2>
<app-profiel [naam]="gebruiker"></app-profiel>
```
```ts
// src/app/profiel/profiel.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.html'
})
export class Profiel {
  @Input() naam!: string;
}
```
```html
<!-- src/app/profiel/profiel.html -->
<p>Naam: {{ naam }}</p>
```

Uitleg:
- De `Kaart`-component heeft een variabele `gebruiker`
- Via `[naam]="gebruiker"` wordt de naam doorgegeven aan het `Profiel`-component.
- In `Profiel` wordt `@Input() naam` gebruikt om de waarde te ontvangen en in de template te tonen.
- Property binding `[src]="avatarUrl"` en `[alt]="gebruiker"` zorgt ervoor dat het `<img>`-element automatisch de juiste waarden krijgt.

### Event van child naar parent: `@Output`
Met `@Output()` kan een childcomponent een event "uitsturen" naar de parent. Zo kan het child bijvoorbeeld een actie melden of data terugsturen wanneer er iets gebeurd.
```ts
// src/app/profiel/profiel.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.html'
})
export class Profiel {
  @Output() naamGewijzigd = new EventEmitter<string>();

  veranderNaam() {
    // Stuurt de nieuwe naam door naar de parent
    this.naamGewijzigd.emit('Jane');
  }
}
```
```html
<!-- src/app/profiel/profiel.html -->
<button (click)="veranderNaam()">Verander naam</button>

```

```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';
import { Profiel } from '../profiel/profiel';

@Component({
  selector: 'app-kaart',
  imports: [Profiel],
  templateUrl: './kaart.html',
  styleUrl: './kaart.css',
})

export class Kaart {
  gebruiker = "John";

  updateGebruiker(nieuweNaam: string) {
    this.gebruiker = nieuweNaam;
  }
}
```
```html
<!-- src/app/kaart/kaart.html -->
<app-profiel (naamGewijzigd)="updateGebruiker($event)"></app-profiel>
<p>Huidige gebruiker: {{ gebruiker }}</p>

```
Uitleg:
- Het `Profiel`-component heeft een `@Output()` property genaamd `naamGewijzigd`, gekoppeld aan een `EventEmitter`.
- Wanneer de knop wordt aangeklikt, roept `veranderNaam()` `naamGewijzigd.emit()` aan met de nieuwe waarde `'Jane'`.
- De parent `Kaart` luistert naar dit event via `(naamGewijzigd)="updateGebruiker($event)"`.
- Het `$event` bevat precies de waarde die door `emit()` werd verstuurd.
- De functie `updateGebruiker()` ontvangt de nieuwe naam en past de variabele `gebruiker` aan.
Dankzij Angular's reactiviteit wordt de UI automatisch bijgewerkt en zie je direct de nieuwe naam in het `<p>`-element.

### Two-way binding tussen parent en child
Two-way binding laat een parentcomponent en childcomponent automatisch hun waarden synchroniseren.
Angular doet dit door:
- Een `@Input()` te gebruiken voor de huidige waarde
- Een `@Output()[naam]Change` te gebruiken voor de wijzigingen
- De parent gebruikt `[(naam)]="property"` voor automatische synchronisatie
Dit patroon vervangt dus de handmatige combinatie van `[property]` en `(propertyChanged)` waarbij property binding en event binding apart gekoppeld moeten worden..

```ts
// src/app/profiel/profiel.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.html'
})
export class Profiel {
  @Input() naam!: string;
  @Output() naamChange = new EventEmitter<string>();

  veranderNaam() {
    this.naamChange.emit('Jane');
  }
}
```
```html
<!-- src/app/profiel/profiel.html -->
<h3>Profiel component</h3>
<p>Naam: {{ naam }}</p>
<button (click)="veranderNaam()">Verander naam</button>
```
Uitleg:
  - `@Input() naam` ontvangt de waarde van de parent
  - `@Output() naamChange` stuurt de nieuwe waarde terug
  - Angular detecteert automatisch dat dit samen een **two-way binding pair** vormt.

In het parentcomponent zien we dan het volgende:
```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';
import { Profiel } from '../profiel/profiel';

@Component({
  selector: 'app-kaart',
  imports: [Profiel],
  templateUrl: './kaart.html'
})
export class Kaart {
  gebruiker = "John";
}
```
```html
<!-- src/app/kaart/kaart.html -->
<h2>Kaart Component</h2>

<!-- Two-way binding -->
<app-profiel [(naam)]="gebruiker"></app-profiel>

<p>Huidige gebruiker: {{ gebruiker }}</p>
```
Uitleg:
- `[(naam)]="gebruiker"` betekent:
  - Stuur `gebruiker`naar child via `@Input() naam`
  - Ontvang wijzigingen van `naamChange` en stel `gebruiker` direct in op de nieuwe waarde van naam.

:::warning[Belangrijk]
Het `Change`-gedeelte van `naamChange` is essentieel. Angular gebruikt deze suffix om automatisch te bepalen naar welk event het moet luisteren bij two-way binding. Wanneer je `[(naam)]` gebruikt, plakt Angular achterliggend zelf `"Change"` achter de variabelenaam en zoekt dus naar een event met de naam `naamChange`. Bestaat die Output niet, dan werkt two-way binding niet. Daarom moet elke two-way binding bestaan uit een `@Input()` met een bepaalde naam en een `@Output()` met dezelfde naam gevolgd door `Change`.
:::
### Event payloads
Een `@Output` kan veel meer doorgeven dan alleen een string of een getal. Vaak wordt een heel object doorgestuurd, bijvoorbeeld een geselecteerd product of een formulierveld.

```ts
// src/app/product/product.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.html'
})
export class Product {
  @Output() productGeselecteerd = new EventEmitter<{ id: number; naam: string }>();

  selecteerProduct() {
    this.productGeselecteerd.emit({ id: 1, naam: 'Laptop' });
  }
}
```
```html
<!-- src/app/product/product.html -->
<button (click)="selecteerProduct()">Selecteer product</button>
```
```ts
// src/app/winkel/winkel.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-winkel',
  templateUrl: './winkel.html'
})
export class Winkel {
  geselecteerdProduct: { id: number; naam: string } | null = null;

  updateProduct(product: { id: number; naam: string }) {
    this.geselecteerdProduct = product;
  }
}
```
```html
<!-- src/app/winkel/winkel.html -->
<app-product (productGeselecteerd)="updateProduct($event)"></app-product>
<p>Geselecteerd product: {{ geselecteerdProduct?.naam }}</p>
```
Uitleg:
- Het child-component `Product` stuurt via `productGeselecteerd.emit()` een object door.
- Het parent-component `Winkel` ontvangt dit object via `(productGeselecteerd)="updateProduct($event)"`.
- De componentvariabele `geselecteerdProduct` wordt bijgewerkt en automatisch weergegeven in de template dankzij Angular’s reactiviteit.


### ngOnChanges

Soms moet een child-component reageren wanneer er nieuwe data via `@Input()` binnenkomt.  

Angular biedt hiervoor de lifecycle hook `ngOnChanges`. Hiermee kan je logica uitvoeren telkens wanneer een input-property verandert.

Kort samengevat:
- `ngOnChanges(changes: SimpleChanges)` wordt automatisch aangeroepen wanneer een `@Input()`-waarde verandert.
- `changes` bevat informatie over oude en nieuwe waarden.
- Dit is handig om side-effects uit te voeren of interne state bij te werken bij nieuwe input.

> Angular Signals biedt een modernere en vaak eenvoudiger manier om op veranderingen te reageren. Zie later.

```ts
// src/app/profiel/profiel.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.html'
})
export class Profiel implements OnChanges {
  @Input() naam!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['naam']) {
      console.log(`Naam gewijzigd van ${changes['naam'].previousValue} naar ${changes['naam'].currentValue}`);
    }
  }
}
```
```html
<!-- src/app/profiel/profiel.html -->
<p>Naam: {{ naam }}</p>
```
```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-kaart',
  templateUrl: './kaart.html'
})
export class Kaart {
  gebruiker = "John";

  veranderNaam() {
    this.gebruiker = "Jane";
  }
}
```
```html
<!-- src/app/kaart/kaart.html -->
<app-profiel [naam]="gebruiker"></app-profiel>
<button (click)="veranderNaam()">Verander naam</button>
```
Uitleg:
- Wanneer de parent `Kaart` de waarde van `gebruiker` aanpast, wordt deze nieuwe waarde automatisch doorgegeven aan het child `Profiel`.  
- `ngOnChanges` detecteert deze verandering en voert de logica uit (bijvoorbeeld logging of interne updates).  
- Dankzij Angular’s reactiviteit wordt de UI automatisch bijgewerkt met de nieuwe naam.

Angular-apps zijn **Single Page Applications (SPA).**. Dat betekent dat er één HTML-pagina geladen wordt en dat de content dynamisch wordt aangepast zonder dat de pagina volledig herladen wordt. Routing in Angular is het mechanisme waarmee je verschillende componenten toont op basis van de URL. De Router beheert hiervoor twee dingen: welke component gekoppeld zijn aan welke routes en hoe je navigeert tussen deze componenten.

Routing bestaat uit drie belangrijke onderdelen in de code:
- Routes definiëren in `app.routes.ts`
- Applicatieconfiguratie in `app.config.ts`
- bootstrapping in `main.ts`

### Routes definiëren
Routes worden in Angular gedefinieerd als een mapping tussen een path en een component. Stel dat we een eenvoudige applicatie hebben met een homepagina en een profielpagina. we maken dan het volgende aan in `app.routes.ts`

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Profiel } from './profiel/profiel';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'profiel/:id', component: Profiel }
];
```

Hier zien we dat de lege string `''` verwijst naar de homepagina. De tweede route is een dynamische route: `/profiel/:id`. Het deel `:id` is een **route paramter** die je in de component kan uitlezen. Zo kan één component meerdere profielen tonen, afhankelijk van het id in de URL.

#### Applicatieconfiguratie
In `app.config.ts` worden providers gedefinieerd die beschikbaar zijn in de volledige toepassing. Bij Angular 20 zijn er standaard providers aanwezig die de meeste projecten zonder extra instellingen gebruiken. De router wordt hier via `provideRouter()` geactiveerd.

```ts
// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
```
`provideRouter(routes)` zorgt ervoor dat de router beschikbaar is in de volledige applicatie.
De overige providers worden standaard toegevoegd door Angular voor foutafhandeling en performance-optimalisaties. Voor routing hoef je deze niet aan te passen, maar ze blijven deel uitmaken van de standaardconfiguratie.

### Bootstrapping
`main.ts` start de applicaties op. hierbij wordt het rootcomponent ingesteld en wordt de applicatieconfiguratie gebruikt om de router en andere providers in te laden.
```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```
### Navigeren binnen de applicatie
In de templates van je componenten werk je met `routerLink` om de gebruiker naar een andere toue te laten gaan. Dit gebeurt declaratief, zonder extra TypeScript-code. Om verder te gaan met het voorbeeld van eerder, zou dit een link kunnen zijn in je `Home`-component:
```html
<!-- src/app/home/home.html -->
<a routerLink="/profiel/42">Ga naar profiel</a>
```
> In dit voorbeeld vullen we `id` rechtstreeks in met het getal `42`. In de realiteit zal ook dit deel dynamisch ingevuld worden.

### de router-outlet
Aangezien dat de componenten dynamisch worden ingeladen, moeten we in de root-template `app.html` aangeven, waar de component van die specifieke router moet worden ingeladen. Dit kunnen we doen met `<router-outlet>`

```html
<!-- src/app/app.html -->
<h1>Mijn App</h1>

<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/profiel/1">Profiel</a>
</nav>

<!-- Hier wordt Home of Profiel getoond -->
<router-outlet></router-outlet>
```
Belangrijk hierbij is dat in `app.ts` ook `RouterOutlet` geïmporteerd is. Bij de standaardinitialitatie van de applicatie wordt dit automatisch gedaan.
```ts
// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mijn-angular-project');
}
```