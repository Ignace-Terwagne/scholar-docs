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
- De `Kaart`-component heeft een variabele `gebruiker` en een `avatarUrl`.
- Via `[naam]="gebruikers"` wordt de naam doorgegeven aan het `Profiel`-component.
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
- De functie `updateGebruiker()` ontvangt de nieuwe naam en past de variabele `gebruiker` aan.
Dankzij Angular's reactiviteit wordt de UI autoamtisch bijgewerkt en zie je direct de nieuwe naam in het `<p>`-element.

### Two-way binding tussen parent en child
Two-way binding laat een parentcomponent en childcomponent automatisch hun waarden synchroniseren. In Angular 20 kan dit met property (`@Input`) en event (`@Output`) binding.

Voor een eenvoudig voorbeeld gebruiken we een `Kaart`-component die een naam bijhoudt en via een child-component kan wijzigen:

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
    this.naamGewijzigd.emit('Jane');
  }
}
```
```html
<!-- src/app/profiel/profiel.html -->
<h3>Profiel component</h3>
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
<h2>Kaart Component</h2>
<p>Huidige gebruiker: {{ gebruiker }}</p>
<app-profiel (naamGewijzigd)="updateGebruiker($event)"></app-profiel>
```
Uitleg:
- Het child-component `Profiel` heeft een `@Output()` property genaamd `naamGewijzigd`, gekoppeld aan een `EventEmitter<string>`.
- In de functie `veranderNaam()` wordt `naamGewijzigd.emit('Jane')` aangeroepen wanneer de knop in de template wordt geklikt.
- Het parent-component `Kaart` luistert naar dit event met `(naamGewijzigd)="updateGebruiker($event)"`.
- De functie `updateGebruiker()` ontvangt de nieuwe waarde en past de componentvariabele `gebruiker` aan.
- Dankzij Angular's reactiviteit wordt de UI automatisch bijgewerkt en zie je direct de nieuwe naam in het `<p>`-element.

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