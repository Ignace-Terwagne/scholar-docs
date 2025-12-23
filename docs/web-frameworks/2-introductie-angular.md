---
id: wf-theo-2
title: 2. Introductie Angular
sidebar_label:  2. Introductie Angular
---

In dit hoofdstuk bekijken we **Angular**. We leggen uit wat Angular is, hoe het is ontstaan, welke voordelen het biedt en welke tools je nodig hebt om ermee te werken. Daarnaast bekijken we hoe een Angular-applicatie is opgebouwd en hoe je de onderdelen ervan gebruikt om interactieve en herbruikbare webapplicaties te maken.

## 1. Angular in vogelvlucht
**Angular** is een front-end framework van Google. Het is open-source en geschikt voor zowel kleine projecten als grote toepassingen. Het begon in 2010 als AngularJS en werd in 2016 volledig vernieuwd tot Angular 2+, geschreven in TypeScript.

Vanaf versie 16 (2023) kreeg Angular een soort Renaissance met nieuwe mogelijkheden:
- Standalone Components: componenten die volledig zelfstandig kunnen bestaan, waardoor je minder herhaalde code hoeft te schrijven.
- Nieuwe template syntax (`@if`, `@for`): manieren om elementen op de pagina conditioneel of herhaald weer te geven.
- Signals: een modern reactiviteitsmodel waarmee veranderingen in gegevens automatisch en efficiënt op het scherm worden bijgewerkt.

Vandaag is Angular 20 (2024) een volledig ecosysteem met CLI, Material en RxJS. Het framework helpt ontwikkelaars om grote, onderhoudbare en schaalbare webapplicaties te bouwen.

## 2. Tools en setup

Om met Angular te werken, heb je een aantal basis-tools nodig:

- **Node.js**: de runtime waarmee JavaScript op de server kan draaien.
- **npm**: de package manager om libraries en dependencies te installeren.
- **Angular CLI**: een command-line tool die het aanmaken en beheren van Angular-projecten eenvoudig maakt.
- **Visual Studio Code (VSCode)**: een editor waarin je efficiënt Angular-code kunt schrijven.
- **Angular Language Service plugin**: geeft betere hints en foutmeldingen in VSCode.

:::note
**Visual Studio Code** is een voorbeeld van een **Interactive Development Environment (IDE)**. Angular-projecten werken ook met andere IDE's, maar in de voorbeelden in deze documentatie gebruiken we VSCode.  
De **Angular Language Service plugin** werkt alleen in Visual Studio Code.
:::
### Angular CLI
De Angular CLI is een handig hulpmiddel bij het werken met Angular-projecten. Met de CLI kun je snel een nieuw project opzetten en automatisch de basisstructuur en boilerplate-code laten genereren. Je kunt ook eenvoudig componenten, services en modules aanmaken met de ingebouwde generators. Bovendien start de CLI een lokale ontwikkelserver met live-reloading, zodat je je wijzigingen direct in de browser kunt bekijken.

Belangrijke commando’s zijn onder andere:
| Commando                       | Uitleg                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| `ng new <projectnaam>`         | Maakt een nieuw Angular-project aan met alle basisbestanden.                                 |
| `ng serve`                     | Start de ontwikkelserver met live-reloading, zodat je wijzigingen direct in de browser ziet. |
| `ng generate component <naam>` | Maakt een nieuwe component aan in je project.                                                |
| `ng generate service <naam>`   | Maakt een nieuwe service aan in je project.                                                  |
| `ng build`                     | Bouwt een productieklare versie van de applicatie.                                           |

De CLI biedt duidelijke voordelen: je kunt snel en eenvoudig een project opzetten, de structuur van je projecten blijft consistent, en je productiviteit gaat omhoog dankzij de ingebouwde generators en tools voor testen en deployen. Bovendien is het geschikt voor grotere, professionele projecten, omdat het automatisch de Angular best practices volgt.

### Een angular-project stap-voor-stap opzetten
Om een nieuwe Angular-applicatie te starten, volg je deze stappen:
#### 1. Controleer of Node.js en npm geïnstalleerd zijn
```bash
node -v
npm -v
```
Als je iets terugkrijgt zoals `v20.19.5` of `10.8.2`, betekent dit dat Node.js en npm correct geïnstalleerd zijn.
Krijg je een foutmelding, installeer dan eerst Node.js (npm wordt automatisch mee geïnstalleerd).

#### 2. Installeer Angular CLI
De Angular CLI maakt het eenvoudig om projecten aan te maken en te beheren. Installeer het globaal zodat het in alle projecten beschikbaar is:
```bash
npm install -g @angular/cli
```
Om te controleren of de installatie geslaagd is, voer je daarna dit commando uit:
```bash
ng version
```
Als alles correct geïnstalleerd is, krijg je een overzicht te zien zoals:
```bash


     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    


Angular CLI: 20.3.2
Node: 20.19.5
Package Manager: npm 10.8.2
OS: linux x64
```
Dit bevestigt dat de CLI klaar is voor gebruik.

#### 3. Maak een nieuw Angular-project aan
Kies een naam voor je project en vul dit in op `<projectnaam>`

```bash
ng new <projectnaam>
```
Dit maakt automatisch alle benodigde bestanden aan in de projectmap. Het proces kan even duren; onderbreek het niet.

Tijdens het aanmaken kun je enkele opties kiezen, zoals routing en styling. Voor deze cursus gebruiken we standaard CSS, geen server-side rendering, en geen zone.js of AI-tools. Zo blijft de setup eenvoudig en overzichtelijk.

#### 4. Het project starten
Nadat het project is aangemaakt, kun je het lokaal opstarten om de standaard Angular-app te bekijken.

Ga eerst naar de projectmap:
```bash
cd <projectnaam>
```
Start vervolgens de ontwikkelserver:
```bash
ng serve
```
Hiermee wordt een lokale server gestart die je in de browser kunt openen. Standaard is dit:
```bash
http://localhost:4200
```

Je ziet nu de standaardstartpagina van Angular.
De ontwikkelserver vernieuwt automatisch wanneer je code aanpast — je hoeft de server dus niet opnieuw te starten.

## 3. Structuur van een Angular-applicatie

Een Angular-applicatie heeft een vaste structuur die helpt om de code overzichtelijk en onderhoudbaar te houden.  

### Belangrijke configuratiebestanden

```
mijn-angular-project/
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

| Bestand              | Functie                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `package.json`       | Bevat de dependencies en scripts voor het project                 |
| `package-lock.json`  | Houdt exact bij welke versies van dependencies zijn geïnstalleerd |
| `angular.json`       | Configuratie voor de Angular CLI                                  |
| `tsconfig.json`      | Algemene TypeScript-instellingen                                  |
| `tsconfig.app.json`  | TypeScript-instellingen specifiek voor de applicatie              |
| `tsconfig.spec.json` | TypeScript-instellingen voor tests                                |

### De `src/`-map

Alle code van de applicatie staat in de map `src/`, die de kern van het project bevat:

```
mijn-angular-project/
└── src
    ├── app
    ├── index.html
    ├── main.ts
    └── styles.css
```

| Bestand / Map | Functie                                                       |
| ------------- | ------------------------------------------------------------- |
| `main.ts`     | Entry point van de applicatie; hier wordt de app opgestart    |
| `index.html`  | Hostpagina van de Angular-app                                 |
| `styles.css`  | Globale stijlen die voor de hele applicatie gelden            |
| `app/`        | Kern van de applicatie; bevat componenten, modules en routing |

### De `app/`-map

De `app/`-map bevat de belangrijkste onderdelen van de applicatie:

```
mijn-angular-project/
└── src
    └── app
        ├── app.ts
        ├── app.routes.ts
        ├── app.html
        ├── app.css
        ├── app.config.ts
        └── app.spec.ts
```

| Bestand         | Uitleg                                                   |
| --------------- | -------------------------------------------------------- |
| `app.ts`        | Root component (`AppComponent`)                           |
| `app.routes.ts` | Configuratie van navigatie en routering                  |
| `app.html`      | Template van de root component                            |
| `app.css`       | Stijlen specifiek voor de root component                 |
| `app.config.ts` | Configuratiebestand voor de applicatie                   |
| `app.spec.ts`   | Testbestand voor de root component                       |

Alles start bij het **root component** (`AppComponent`). Vanuit dit component worden andere componenten geladen en weergegeven. Zo wordt de applicatie opgebouwd uit kleinere, herbruikbare onderdelen.

### Bootstrapping van een Angular-applicatie

In Angular betekent **bootstrapping** het opstarten van de applicatie door het root component te koppelen aan de webpagina. Dit gebeurt in `main.ts`:

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

Hier doet Angular het volgende:

- **Start de root module/component**: het root component (`AppComponent`) wordt geladen op de pagina.
- **Laadt andere componenten automatisch**: alle componenten die door het root component gebruikt worden, worden weergegeven.
- **Activeert de applicatie**: Angular weet waar te beginnen met het opbouwen van de applicatie.

Kortom, bootstrapping betekent het starten van de Angular-app en het koppelen van het root component aan de pagina.

## 4. Componenten
Een component is de kleinste bouwsteen van een Angular-applicatie. Elke applicatie start bij het root component (`AppComponent`) en andere componenten kunnen als subcomponenten worden gebruikt.

### Opbouw van een component
Een component bestaat altijd uit drie delen:
| Deel           | Wat het doet                                            |
| -------------- | ------------------------------------------------------- |
| **TypeScript** | Logica, data en state van de component                  |
| **Template**   | HTML die de UI definieert en de data uit de class toont |
| **Styles**     | CSS die alleen op deze component van toepassing is      |

Templates en styles kunnen inline in de TypeScript file staan, zoals in het voorbeeld hieronder, maar meestal gebruik je aparte bestanden (`.html` en `.css`) voor overzichtelijkheid en onderhoudbaarheid. 
```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-kaart',
  template: `<p>Kaart werkt!</p>`,
  styles: [`p { color: blue; font-weight: bold; }`]
})
export class Kaart {
  // Hier komt de logica van de component
}
```

```ts
// src/app/kaart/kaart.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-kaart',
  imports: [],
  templateUrl: './kaart.html',
  styleUrl: './kaart.css',
})
export class Kaart {

}
```
In dat geval heb je een bestand `./kaart.html` met de `html`-code voor je component:
```html
<!-- src/app/kaart/kaart.html -->
<p>kaart werkt!</p>
```



### Componenten genereren
Angular CLI maakt het eenvoudig om nieuwe componenten aan te maken en volgt een consistente structuur:
```
ng generate component kaart
```
Dit creëert automatisch:
```
src/app/kaart/
├── kaart.css
├── kaart.html
├── kaart.spec.ts
└── kaart.ts
```
`kaart.css` is het styling bestand
`kaart.html`is de template
`kaart.spec.ts`is het testbestand
`kaart.ts`is het typescript bestand met de logica.

:::info
In oudere Angular-versies werd bij het genereren van een component altijd .component. toegevoegd aan de bestandsnamen, bijvoorbeeld `kaart.component.ts`, `kaart.component.html` en `kaart.component.css`. Dit hielp om componentbestanden snel te herkennen en te onderscheiden van andere TypeScript- of CSS-bestanden.

Met de introductie van standalone componenten in Angular 14 en de moderne CLI-standaarden (Angular 20) is dit niet meer nodig. Wanneer je een component genereert, maakt de CLI nu automatisch een aparte map voor de component en plaatst daarin de bestanden met eenvoudige namen zoals kaart.ts, kaart.html en kaart.css.

Het belangrijkste om te begrijpen is dat dit **alleen een wijziging in de bestandsnaam is**. De inhoud en werking van de component blijft volledig hetzelfde; het is nog steeds een TypeScript‑bestand met een template en bijbehorende styles. Het verwijderen van .component. maakt de structuur iets overzichtelijker, zeker omdat elke component al in een eigen map staat.
:::

### Feature-maps en componentorganisatie
Wanneer je een component genereert met de Angular CLI maakt de CLI automatisch een eigen map `src/app/<component-naam>` aan en plaatst daarin de bestanden. Hierdoor zijn de bestanden van één component netjes gegroepeerd.

Voor grotere features kan je meerdere componenten groeperen in één feature-map:
```
src/app/dashboard/
├── overzicht/
│   ├── overzicht.ts
│   ├── overzicht.html
│   └── overzicht.css
├── statistieken/
│   ├── statistieken.ts
│   ├── statistieken.html
│   └── statistieken.css
```
Om dan een component binnen deze feature te genereren gebruik je het commando:
```
ng generate component dashboard/<component-naam>
```
Dit houdt de structuur overzichtelijk en modulair, en maakt het makkelijker om componenten te hergebruiken of de applicatie uit te breiden.

### Subcomponenten
In Angular kunnen componenten andere componenten bevatten. Het root component (`AppComponent`) fungeert als startpunt en kan child-componenten renderen door hun selector in de template op te nemen. Op deze manier worden applicaties hiërarchisch en modulair opgebouwd, waarbij een component kleinere, herbruikbare onderdelen kan aansturen.

Om een subcomponent te gebruiken, moet deze bekend zijn bij het parent-component via een import. Dit geldt voor elke parent/child-relatie in de applicatie: zonder de juiste import kan een component zijn subcomponenten niet herkennen of renderen. Door subcomponenten op deze manier te declareren, blijft de structuur overzichtelijk en modulair.

```ts
// src/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Kaart } from './kaart/kaart'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Kaart],  // RouterOutlet wordt later behandeld voor routing
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mijn-angular-project');
}
```

Wanneer je deze component hebt geïmporteerd, kan je deze dan gebruiken, in de template van je parent-component:
```html
<!-- src/app/app.html -->
<h1>mijn app</h1>
<app-kaart></app-kaart>
```
:::note
Sinds Angular 17 worden standalone componenten de standaard en introduceert Angular nieuwe shorthand-velden zoals `styleUrl` en `templateUrl`.
Deze vervangen de oudere arrays `styleUrls` en `templateUrls`, maar beide blijven geldig voor backwards compatibility.
:::

### Best practices
- **Houd componenten klein en overzichtelijk**: één component heeft één duidelijke verantwoordelijkheid. Dit maakt de code eenvoudiger te begrijpen en te onderhouden.  
- **Gebruik feature-maps voor grotere features**: groepeer gerelateerde componenten in één map. Zo voorkom je dat alle componenten in dezelfde map staan zonder duidelijkheid welke bij welke feature hoort.  
- **Maak componenten herbruikbaar**: bij het ontwerpen van een component, denk: "Kan ik deze later in een andere context of feature hergebruiken?" Vermijd dat een component te veel specifieke logica bevat die alleen voor één plek geldt. Plaats gedeelde componenten in een aparte map, bijvoorbeeld `src/app/shared/`, zodat ze eenvoudig door meerdere features gebruikt kunnen worden.

## 5. Data binding
Data binding is het mechanisme waarmee een Angular-component (de TypeScript-class) en zijn template (HTML) met elkaar communiceren. Het maakt het mogelijk om componentdata in de UI te tonen en omgekeerd gebruikersinteracties uit de UI terug te sturen naar de component.

Angular ondersteunt vier hoofdvormen van data binding:

- **Interpolation:** toont de waarde van een variabele in de template.
- **property binding:** koppelt een attribuut van een DOM-element aan een variabele.
- **Event binding:** reageert op gebeurtenissen zoals clicks of input.
- **Two-way binding:** laat een variabele tegelijk lezen en schrijven, bijvoorbeeld bij formulieren.

#### Component interaction
Wanneer er een dataflow is van een parent component naar een child component spreken we van **component interaction**. Dit gebeurt via `@Input()` en `@Output()` en maakt het mogelijk dat componenten met elkaar communiceren. Hoewel dit vaak property binding gebruikt, is het concept apart: het gaat om componentcommunicatie, niet om binding naar DOM-elementen.

### Interpolation
Interpolation wordt gebruikt om waarden uit de componenten direct in de template weer te geven. Dit gebeurt met dubbele accolades.
```html
<!-- src/app/kaart/kaart.html -->
<p>Hallo {{ gebruiker }}</p>
```
```ts
// src/app/kaart/kaart.ts
export class Kaart {
  gebruiker = "John";
}
```
Belangrijk hierbij: je kunt expressies gebruiken (zoals wiskundige berekeningen), maar geen statements zoals loops of if‑structuren. Interpolation wordt vooral gebruikt om dynamische tekst of data in de HTML weer te geven.

Hoewel je het soms ook in attributen ziet, is dit eigenlijk een vorm van property binding.

```ts
// src/app/kaart/kaart.ts
export class Kaart {
  gebruiker = "John";
  titel = 'dit is een kaart';
}
```
```html
<!-- src/app/kaart/kaart.html -->
<p title='{{ titel }}'>Hallo {{ gebruiker }}</p>
```
:::note
Het `title`-attribuut van een `<p>`-tag geeft extra informatie weer over de paragraaf, die meestal verschijnt als een tooltip wanneer je er met de muis overheen gaat.
:::
### Property binding
Property binding koppelt een attribuut of property van een DOM-element aan een variabele in de component. Zo kan je de eigenschappen van elementen dynamisch aanpassen vanuit de component.

De notatie hiervoor is `[property]`
```html
<!-- src/app/kaart/kaart.html -->
<img [src]="avatarUrl" [alt]="gebruiker">
```
```ts
// src/app/kaart/kaart.ts
export class Kaart {
  gebruiker = "John";
  avatarUrl = "https://placehold.co/600x400";
}
```
Hier zorgt Angular ervoor dat de `src` en `alt` van het `<img>`-element automatisch de waarden van de component volgen. Als `avatarUrl` verandert, past Angular het element automatisch aan.

:::warning
**Let op:** Property binding is krachtiger en veiliger dan interpolation bij DOM-attributen, bijvoorbeeld bij URLs of formulierelementen.
:::

#### Custom componenten
Wanneer je een custom component gebruikt, kun je data doorsturen van een parent component naar een child component met `@Input()`:
```ts
// src/app/profiel/profiel.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profiel',
  imports: [],
  templateUrl: './profiel.html',
  styleUrl: './profiel.css',
})
export class Profiel {
  @Input() naam!: string;
}
```
```html
<!-- src/app/profiel/profiel.html -->
<h3>Profiel component</h3>
<p>Naam: {{ naam }}</p>
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

// src/app/kaart/kaart.ts
export class Kaart {
  gebruiker = "Alice";
  avatarUrl = "https://placehold.co/600x400";
}
```
```html
<!-- src/app/kaart/kaart.html -->
<h2>Kaart Component</h2>
<app-profiel [naam]="gebruiker"></app-profiel>
```
Hierdoor wordt de waarde van `gebruiker` uit de `Kaart`-component automatisch doorgegeven aan het `Profiel`-component, dat het vervolgens kan weergeven in zijn eigen template.

### Event binding
Event binding laat een component reageren op gebeurtenissen die plaatsvinden in de UI, zoals clicks, input of submit. Hiermee kan je functies in de component aanroepen wanneer een event plaatsvindt.

De notatie is `(event)="handler($event)`

```html
<!-- src/app/kaart/kaart.html -->
<label>Naam: </label>
<input [value]="gebruiker" (input)="onInput($event)">
<p>Hallo {{ gebruiker }}</p>
```
```ts
// src/app/kaart/kaart.ts
export class Kaart {
  gebruiker = "John";

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.gebruiker = inputElement.value;
  }
}
```
Bij `(input)="onInput($event)"` wordt de functie `onInput` telkens aangeroepen wanneer er iets wordt ingevoerd in het inputveld. Het speciale `$event` bevat alle informatie over deze gebeurtenis, zoals het element waarop het event plaatsvond en de nieuwe waarde. In de functie halen we deze waarde uit het input-element en passen we de componentvariabele `gebruiker` aan. Dankzij Angular’s reactiviteit wordt de UI meteen bijgewerkt, zodat de nieuwe naam direct in het `<p>`-element verschijnt.

#### Custom componenten
Naast standaard DOM-events, kunnen ook custom componenten events uitsturen. Dit gebeurt via een `@Output()` property in het child-component, meestal gekoppeld aan een `EventEmitter`. Op deze manier kan een child-component communiceren met zijn parent-component.

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
<button (click)="veranderNaam()">Verander naam</button>
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
Hier gebeurt het volgende:
- Het child-component `Profiel` stuurt een event uit via `naamGewijzigd.emit()`.
- Het parent-component `Kaart` luistert naar dit event met `(naamGewijzigd)="updateGebruiker($event)"`.
- De functie `updateGebruiker()` ontvangt de nieuwe waarde en past de componentvariabele gebruiker aan.
- Dankzij Angular’s reactiviteit wordt de UI automatisch bijgewerkt en zie je direct de nieuwe naam in de `<p>`.

### Two-way binding
Two-way binding in Angular 20 combineert property binding (`@Input`) en event binding (`@Output`) op een elegante manier. Hierdoor blijft de data tussen parent en child component altijd gesynchroniseerd, zonder dat je zelf events hoeft te koppelen.
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
  gebruiker = 'John';
}
```

```html
<!-- src/app/kaart/kaart.html -->
<app-profiel [(naam)]="gebruiker"></app-profiel>
<p>Huidige gebruiker: {{ gebruiker }}</p>
```

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
    this.naam = 'Jane';
    this.naamChange.emit(this.naam);
  }
}
```
```html
<!-- src/app/profiel/profiel.html -->
<h2>Profiel component</h2>
<p>Naam: {{ naam }}</p>
<button (click)="veranderNaam()">Verander naam</button>
```
- `[(naam)]="gebruiker"` combineert property binding (`@Input()`) en event binding (`@Output()`).
- Wanneer het child-component de naam wijzigt, wordt het parent-component automatisch bijgewerkt.
- Dankzij Angular’s reactiviteit wordt de UI direct aangepast.

:::info
Oude methode: `ngModel`

Voorheen werd two-way binding vaak gedaan met `[(ngModel)]`, vooral bij formulierelementen zoals `<input>`, `<textarea>` of `<select>`:
```html
<!-- src/app/kaart/kaart.html -->
<label>Naam:</label>
<input [(ngModel)]="gebruiker">
<p>Hallo {{ gebruiker }}</p>

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
}

```
De waarde van de componentvariabele wordt automatisch in de input getoond. Als de gebruiker iets typt, wordt de variabele direct bijgewerkt.

Two-way binding via `ngModel` werkt alleen als je FormsModule importeert in de module waar je component zich bevindt:

```ts
import { FormsModule } from '@angular/forms';
```
In Angular 20 is er een nieuwe manier om two-way binding te doen zonder `ngModel`. De oude methode met `ngModel` blijft echter nog steeds geldig, vooral handig bij eenvoudige formulieren of bij projecten die al veel `ngModel` gebruiken.
:::
## 6. Control flow
Sinds Angular 16 is er een nieuwe manier om control flow in templates te gebruiken. Dit maakt je HTML-logica duidelijker, overzichtelijker en minder foutgevoelig. met control flow bepaal je bijvoorbeeld welke elementen getoond worden of hoe lijsten worden herhaald, direct in de template.

De nieuwe control flow-syntax in Angular maakt templates declaratief en overzichtelijk, doordat de logica direct in de HTML staat. Dit houdt de code dicht bij de UI, verbetert de leesbaarheid en vermindert de kans op fouten. Bovendien vervangt het de oudere `*ngIf`, `*ngFor` en `*ngSwitch` syntax, waardoor de code consistenter en makkelijker te onderhouden is.

### lijsten tonen met `@for`
Met `@for` wordt de template declaratief herhaald voor elk item in een array:

```ts
// src/app/kaart/kaart.ts
export class Kaart {
  gebruikers = [
    { id: 1, naam: 'John' },
    { id: 2, naam: 'Jane' },
    { id: 3, naam: 'Alice' }
  ];
}
```
```html
<!-- src/app/kaart/kaart.html -->
<ul>
  @for (gebruiker of gebruikers; track gebruiker.id) {
  <li>
    {{ gebruiker.naam }}
  </li>
  }
</ul>
```
Uitleg:
- `gebruiker of gebruikers`: `gebruiker` is de tijdelijke variabele die verwijst naar elk item in de array `gebruikers`.
- track `gebruiker.id`: Angular gebruikt deze `track`-key om efficiënt DOM-updates door te voeren. Als de array verandert (bijvoorbeeld een gebruiker wordt toegevoegd of verwijderd), weet Angular welk `<li>`-element behouden of verwijderd moet worden.
- Alles tussen de `{ ... }` wordt herhaald voor elk item. In dit voorbeeld wordt voor elke gebruiker een `<li>` aangemaakt dat de naam toont.

### Keuzes maken met `@switch`
Met `@switch` kun je in je template eenvoudig verschillende opties afhandelen, vergelijkbaar met een switch‑statement in TypeScript. Dit is handig wanneer je op basis van een waarde verschillende elementen wilt tonen.

```ts
// src/app/kaart/kaart.ts
export class Kaart {
  rol = 'admin'; // mogelijke waarden: 'admin', 'gebruiker', 'gast'
}
```
```html
<!-- src/app/kaart/kaart.html -->
<div>
  @switch (rol) {
    @case ('admin') {
      <p>Welkom, administrator!</p>
    }
    @case ('gebruiker') {
      <p>Welkom, gebruiker!</p>
    }
    @default {
      <p>Welkom, gast!</p>
    }
  }
</div>
```
Uitleg:
- `@switch (rol)`: kijkt naar de waarde van de variabele `rol`.

- `@case ('waarde')`: voert deze template uit als de waarde overeenkomt.

- `@default`: wordt uitgevoerd als geen enkele `@case` overeenkomt.

