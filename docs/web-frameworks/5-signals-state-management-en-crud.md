---
id: wf-theo-5
title: 5. Signals, State Management & CRUD
sidebar_label: 5. Signals, State Management & CRUD
---

In dit hoofdstuk behandelen we geavanceerdere concepten zoals signalen, state management en CRUD-operaties (Create, Read, Update, Delete) binnen webframeworks. We zullen zien hoe deze concepten kunnen worden toegepast om dynamische en interactieve webapplicaties te bouwen.


## 1. Angular Signals

### Hoe werkte Angular voor Signals?
Voor Angular Signals gebruikte Angular Zone.js om te detecteren wanneer er iets asynchroon gebeurde, zoals een klik, een timer of een HTTP-call. Zone.js onderschepte die acties en liet Angular weten dat er mogelijk iets veranderd was. Angular startte dan globale change detection, zonder te weten welke data gewijzigd was of waar die gebruikt werd.

Dit model werkte automatisch en betrouwbaar, maar het was weinig gericht. Angular controleerde vaak veel meer componenten dan nodig.

Omdat Angular niet wist welke data precies veranderd was, moest het breed controleren. Een kleine wijziging in één component kon daardoor effect hebben op een groot deel van de applicatie. State zat bovendien verspreid over componenten, services en RxJS-constructies, waardoor het moeilijk was om een duidelijke bron van waarheid aan te wijzen.

Voor eenvoudige UI-state werd vaak RxJS gebruikt, wat extra complexiteit meebracht. Bovendien bleef veel van dit gedrag verborgen framework-magie, waardoor het niet altijd duidelijk was waarom iets wel of niet opnieuw gerenderd werd.

### De introductie van Signals in Angular
Signals maken state expliciet. Angular weet exact waar een waarde gelezen wordt en kan daardoor enkel die delen van de UI bijwerken die ervan afhankelijk zijn. In plaats van te reageren op “er is iets gebeurd”, reageert Angular nu op “deze specifieke waarde is veranderd”.

Dat maakt change detection gerichter, statebeheer duidelijker en het mentale model eenvoudiger voor developers.

### Signals vs gewone variabelen
Gewone variabelen zijn simpelweg opslagplaatsen voor data. Wanneer je een gewone variabele wijzigt, weet het framework niet automatisch dat er iets veranderd is. Hierdoor moet je handmatig aangeven dat de UI bijgewerkt moet worden.

Denk bijvoorbeeld aan een teller die je bijhoudt met een gewone variabele:

```typescript
let count = 0;
function increment() {
  count++;
}
```
Hier moet je zelf zorgen dat de UI wordt bijgewerkt wanneer `count` verandert.

Met signals daarentegen, is het framework op de hoogte van wijzigingen. Wanneer je een signal wijzigt, wordt automatisch de UI bijgewerkt waar dat signal wordt gebruikt:

```typescript
import { signal } from '@angular/core';
const count = signal(0);
function increment() {
  count.set(count() + 1);
}
```
Hier zorgt het signal ervoor dat de UI automatisch wordt bijgewerkt wanneer `count` verandert. Dit gebeurt doordat de componenten worden "geabonneerd" op het signal, waardoor ze weten wanneer ze opnieuw moeten renderen.

### Signals vs Observables
Een signal is gewoon een waarde die je opvraagt wanneer je ze nodig hebt. Als die waarde verandert, weet Angular automatisch welke stukken van de UI opnieuw moeten worden getekend. Signals leven in het geheugen, zijn synchronisch en worden vooral gebruikt om te bepalen wat de gebruiker ziet op dit moment.

Een observable daarentegen is een stroom van waarden over tijd. Je krijgt niet één waarde, maar mogelijk meerdere, op verschillende momenten. Observables zijn bedoeld voor dingen die vanzelf binnenkomen, zoals HTTP-responses, timers, websockets of user events.

Het verschil zit vooral in wie het initiatief neemt. Bij signals vraagt de component zelf de huidige waarde op. Bij observables duwt de bron nieuwe waarden naar buiten wanneer ze beschikbaar zijn.

Daarom gebruik je signals voor UI-state, zoals een teller, een filter of een geselecteerd item. Observables gebruik je voor asynchrone gebeurtenissen en data die over tijd verandert.

Het ene vervangt het andere niet; ze vullen elkaar aan. Signals zijn ideaal voor directe UI-state, terwijl observables beter zijn voor het afhandelen van asynchrone data en events.

Observables kunnen wel worden omgezet naar signals als je de laatste waarde wilt gebruiken in de UI. Dit kan met de `toSignal()` functie:
```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const data$: Observable<DataType> = httpClient.get<DataType>('api/data');
const dataSignal = toSignal(data$);
```
Hiermee kun je de laatste waarde van de observable gebruiken als een signal in je component.
Ook kun je een signal omzetten naar een observable met de `toObservable()` functie:
```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
const count = signal(0);
const count$ = toObservable(count);
```
Dit is handig als je een signal wilt gebruiken in een context die observables verwacht, zoals bij RxJS-operators of bepaalde Angular API's.


### Writeable en readonly Signals
Signals kunnen zowel schrijfbaar (writable) als alleen-lezen (readonly) zijn. Een schrijfbaar signal kan worden aangepast met de `set`-methode. Bijvoorbeeld:
```typescript
import { signal } from '@angular/core';
const count = signal(0);
count.set(5); // Wijzigt de waarde van count naar 5
```
Een alleen-lezen signal kan niet direct worden aangepast. Het wordt vaak gebruikt om data te exposen zonder dat externe code deze kan wijzigen. Bijvoorbeeld:
```typescript
import { signal, readonly } from '@angular/core';
const _count = signal(0);
const count = readonly(_count); // Alleen-lezen versie van _count
```
Hier kan `count` niet worden aangepast buiten de module waar `_count` is gedefinieerd.
Dit helpt om de integriteit van de data te waarborgen, zeker bij grotere applicaties. Zo ben je er zeker van dat bepaalde waarden alleen intern kunnen worden gewijzigd.

### `set()` vs `update()`
Bij schrijfbare signals zijn er twee manieren om de waarde te wijzigen: `set()` en `update()`.
- `set(newValue)`: Hiermee stel je de waarde van het signal direct in op `newValue`. Dit is handig wanneer je een specifieke nieuwe waarde hebt die je wilt toewijzen.
  
  ```typescript
  count.set(10); // Stelt de waarde van count in op 10
  ```
- `update(updaterFunction)`: Hiermee geef je een functie op die de huidige waarde als parameter ontvangt en een nieuwe waarde retourneert. Dit is handig wanneer de nieuwe waarde afhankelijk is van de huidige waarde.
```typescript
count.update(currentValue => currentValue + 1); // Verhoogt de waarde van count met 1
```
Je kan bij `update()` ook een externe functie gebruiken:
```typescript
function incrementByTwo(value: number): number {
    return value + 2;
}
count.update(incrementByTwo); // Verhoogt de waarde van count met 2
```

Om dit in ons voorbeeld van de teller toe te passen, kunnen we de `increment` functie herschrijven om `update()` te gebruiken:
```typescript
// src/app/counter/counter.ts
import { signal } from '@angular/core';
const count = signal(0);

export class Counter {
    teller = signal();

    increment() {
        this.teller.update(value => value + 1);
    }
}
```
In dit geval verhoogt `increment()` de waarde van `teller` met 1 telkens wanneer het wordt aangeroepen. Wanneer we deze methode koppelen aan een knop in de UI, zal de teller automatisch worden bijgewerkt dankzij het signal-mechanisme.
```html
<!-- src/app/counter/counter.html -->
<button (click)="increment()">Increment</button>
<p>Count: {{ teller() }}</p>
```

### `Computed()` signals
Computed signals zijn afgeleide waarden die automatisch worden bijgewerkt wanneer de onderliggende signalen veranderen. Ze worden gedefinieerd met de `computed()` functie en nemen een functie als parameter die de berekening uitvoert. Bijvoorbeeld:
```typescript
import { signal, computed } from '@angular/core';
const count = signal(0);
const doubleCount = computed(() => count() * 2);
```
Hier is `doubleCount` een computed signal dat altijd de dubbele waarde van `count` bevat. Wanneer `count` verandert, wordt `doubleCount` automatisch bijgewerkt.

Standaard houdt Angular enkel bij welke signalen worden gelezen binnen de UI-template. Wanneer iets in een functie wordt gelezen of aan variabele wordt toegekend, weet Angular niet automatisch dat die functie opnieuw moet worden uitgevoerd als die signalen veranderen.
Om dit op te lossen, kunnen we `computed()` gebruiken om een functie te definiëren die afhankelijk is van andere signalen. Hierdoor weet Angular dat het die functie opnieuw moet uitvoeren wanneer de onderliggende signalen veranderen.
Hier is een voorbeeld van hoe je `computed()` kunt gebruiken in een component:
```typescript
// src/app/teller/teller.ts
import { Component, signal, computed } from '@angular/core';

export class Teller {
    teller = signal(0);
    doubleTeller = computed(() => this.teller() * 2);
    
    increment() {
        this.teller.update(value => value + 1);
    }
}
```
In dit voorbeeld hebben we een `doubleTeller` computed signal dat altijd de dubbele waarde van `teller` bevat. Wanneer `teller` verandert, wordt `doubleTeller` automatisch bijgewerkt.

De functie binnen `computed()` wordt pas uitgevoerd wanneer de waarde voor het eerst gelezen wordt. Angular cachet deze waarde, zodat volgende reads snel zijn en de berekening niet opnieuw hoeft te gebeuren. Als een van de afhankelijke signals verandert, markeert Angular de cache als “invalid” en herberekent de waarde bij de volgende read. Hierdoor kun je veilig zwaardere berekeningen uitvoeren, zoals filters of totals.

Een computed signal is read-only. Je kunt het niet direct aanpassen met `set()` of `update()`. Alle wijzigingen moeten via de bron-signals gebeuren. Dit voorkomt een onduidelijke dataflow en houdt de logica voorspelbaar.

### `Effect()` signals
We gebruiken `Computed()` om afgeleiden waarden te bepalen, maar soms moeten er ook acties worden uitgevoerd wanneer een signal verandert. Hiervoor gebruiken we `effect()`. Een effect is een functie die wordt uitgevoerd telkens wanneer een of meer signalen waarop het afhankelijk is, veranderen. Bijvoorbeeld:
```typescript
import { signal, effect } from '@angular/core';
const count = signal(0);
effect(() => {
  console.log(`Count changed to: ${count()}`);
});
```
Hier wordt de functie binnen `effect()` uitgevoerd telkens wanneer `count` verandert, waardoor we een logbericht krijgen met de nieuwe waarde.

`effect()` houdt ook niet alle signals bij. Angular detecteert automatisch welke signalen worden gelezen binnen de effect-functie en zorgt ervoor dat de functie opnieuw wordt uitgevoerd wanneer een van die signalen verandert.

Het wordt minstens één keer uitgevoerd bij het aanmaken van de effect, daarna telkens wanneer een afhankelijk signal verandert. Effects zijn handig voor het uitvoeren van bijwerkingen zoals het bijwerken van de DOM, het maken van HTTP-aanvragen of het loggen van informatie.

#### Levensduur van effects
Effects blijven actief zolang de component of service waarin ze zijn gedefinieerd bestaat. Wanneer de component wordt vernietigd, worden ook de bijbehorende effects opgeruimd. Dit voorkomt geheugenlekken en zorgt ervoor dat er geen onnodige bewerkingen worden uitgevoerd nadat een component niet meer in gebruik is.

### Wanneer gebruik je wat?
- Gebruik **gewone variabelen** voor tijdelijke opslag binnen functies of methoden waar de variabele niet hoeft te worden weergegeven in de UI.
- Gebruik **signals** voor UI-state die direct invloed heeft op wat de gebruiker ziet, zoals tellers, filters of geselecteerde items.
- Gebruik **observables** voor asynchrone gebeurtenissen en data die over tijd verandert, zoals HTTP-responses, timers of user events.
- Gebruik **computed()** voor afgeleide waarden die automatisch moeten worden bijgewerkt op basis van andere signalen.
- Gebruik **effect()** voor het uitvoeren van bijwerkingen wanneer signalen veranderen, zoals het bijwerken van de DOM of het maken van HTTP-aanvragen.

### State delen via componenten
Zoals we eerder al hebben gezien, kunnen we states (oftewel de waarde van variabelen) delen tussen componenten via Services. Met Angular Signals passen we dit concept toe door signalen in services te definiëren en deze signalen te gebruiken in verschillende componenten.

Een praktisch patroon hiervoor zijn mini-stores: kleine services die één stuk state beheren en reactief maken met signals. Componenten lezen de state via readonly signals en voeren wijzigingen uit via methoden van de store. Dit zorgt voor een centrale, veilige en voorspelbare dataflow.

Als we terugkijken naar het winkelwagen voorbeeld, kunnen we een `CartStore` service maken die de items in de winkelwagen beheert met behulp van signals:

```typescript
// src/app/services/cart-store.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private _items = signal<string[]>([]);

  readonly items = this._items.asReadonly(); // Enkel de readonly versie naar buiten richten

  addItem(item: string) {
    this._items.update((items) => [...items, item]);
  }

  removeItem(item: string) {
    this._items.update((items) => items.filter((i) => i !== item));
  }

  clearItems() {
    this._items.set([]);
  }
}

```
Nu kunnen we deze `CartStore` service gebruiken in verschillende componenten om de winkelwagen state te delen en te beheren.

```typescript
// src/app/components/product-list/product-list.ts
import { Component } from '@angular/core';
import { CartStore } from '../../services/cart-store';
import { inject } from '@angular/core';
export class ProductList {
    private cartStore = inject(CartStore);
    addToCart(product: string) {
        this.cartStore.addItem(product);
        console.log(`${product} added to cart.`);
    }
}
```

```typescript
// src/app/components/cart/cart.ts
import { inject, Component } from '@angular/core';
import { CartStore } from '../../services/cart-store';
export class Cart {
  items = this.cartStore.items;
    cartStore = inject(CartStore);
    constructor() {}
    clearCart() {
        this.cartStore.clearItems();
    }

}
```
```html
<!-- src/app/components/cart/cart.html -->
<h2>Winkelwagen</h2>
<ul>
    @for (let item of items(); let i = $index; track i) {
        <li>{{ item }}</li>
    }
</ul>
<button (click)="clearCart()">Clear Cart</button>
```
```html
// src/app/components/product-list/product-list.html
<h2>Producten</h2>
<ul>
    @for (let product of products; let i = $index; track i) {
        <li>{{ product }} <button (click)="addToCart(product)">Add to Cart</button></li>
    }
</ul>
```
Hier hebben we een `CartStore` service die de winkelwagenitems beheert met behulp van signals. De `ProductList` component kan producten toevoegen aan de winkelwagen via de `addToCart` methode, terwijl de `Cart` component de huidige items in de winkelwagen weergeeft en een knop heeft om de winkelwagen te legen. Beide componenten delen dezelfde state via de `CartStore` service.

We maken gebruik van readonly signals om ervoor te zorgen dat componenten verplicht de methoden van de store gebruiken om wijzigingen aan te brengen, wat de integriteit van de data waarborgt. Zo kan er niet ergens in de code per ongeluk direct in de signal worden geschreven.

## 2. State Management met Signals
State verwijst naar de data die bepaalt wat de gebruiker ziet in een applicatie. Zonder een duidelijke structuur kan deze state verspreid raken over meerdere componenten, waardoor de code moeilijk te onderhouden en foutgevoelig wordt.

Met Angular Signals kun je state centraal beheren, waardoor deze voorspelbaar en efficiënt wordt. In dit model bouwen we vaak kleine, goed afgebakende mini-stores die verantwoordelijk zijn voor één stuk state en de bijbehorende logica. Zo ontstaat een duidelijke structuur: componenten lezen de state en voeren acties uit via de store, terwijl de store zelf de mutaties en afgeleiden beheert.

Met stores en signals zorgen we ervoor dat:

- Elke store houdt één duidelijk stukje data bij.
- Componenten werken alleen met de data, de afgeleiden en de acties.
- De data is veilig omdat je binnen de store kunt aanpassen en buiten de store alleen kunt lezen.
- Alles verloopt voorspelbaar omdat acties de data aanpassen, selectors de afgeleiden berekenen en effects eventuele externe acties uitvoeren.

Hierbij geldt dat de term mini-store aangeeft dat het gaat om een klein, specifiek stukje state. Een concreet voorbeeld is bijvoorbeeld de `CartStore` uit het winkelwagenvoorbeeld, die enkel de items van de winkelwagen beheert.

### Persistent storage
We hebben nu wel een manier om bij te houden wat er in de winkelwagen zit, maar zodra we de pagina herladen, is alles weer weg. Het concept van dit bij te houden noemen we persistentie. We willen dat de data blijft bestaan, zelfs als de gebruiker de pagina verlaat of de browser sluit.

Een eenvoudige manier om persistentie te implementeren is door gebruik te maken van de `localStorage` API van de browser. We kunnen de winkelwagenitems opslaan in `localStorage` telkens wanneer ze worden bijgewerkt, en ze laden wanneer de `CartStore` wordt geïnitialiseerd.

```typescript
// src/app/services/cart-store.ts
import { Injectable, signal, effect } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class CartStore {
    private _items = signal<string[]>(this.loadItems());
    readonly items = this._items.asReadonly();
    constructor() {
        // Sla de items op in localStorage telkens wanneer ze veranderen
        effect(() => {
            this.saveItems(this._items());
        });
    }
    addItem(item: string) {
        this._items.update((items) => [...items, item]);
    }
    removeItem(item: string) {
        this._items.update((items) => items.filter((i) => i !== item));
    }
    clearItems() {
        this._items.set([]);
    }
    private saveItems(items: string[]) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }
    private loadItems(): string[] {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    }
}
```
In dit voorbeeld laden we de winkelwagenitems uit `localStorage` wanneer de `CartStore` wordt gemaakt. We gebruiken een effect om de items op te slaan in `localStorage` telkens wanneer ze veranderen. Hierdoor blijft de inhoud van de winkelwagen behouden, zelfs als de gebruiker de pagina herlaadt of de browser sluit.

:::info
In een echte applicatie wordt persistentie vaak complexer met caching, synchronisatie met een backend en offline ondersteuning. Voor eenvoudige toepassingen is `localStorage` echter een prima startpunt.
:::


### Async state via externe API
In veel applicaties komt data van externe bronnen, zoals een backend API. We kunnen Angular Signals gebruiken om deze asynchrone data op te halen en te beheren binnen onze stores.
Laten we een voorbeeld bekijken waarin we productdata ophalen van een externe API en deze beheren met signals in een `ProductStore`.

:::info
We gebruiken hier een endpoint `https://fakestoreapi.com/products` als voorbeeld. In een echte applicatie zou je dit vervangen door je eigen backend API. Deze API retourneert een lijst van producten in JSON-formaat.
```typescript
// src/app/services/product-store.ts
import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}
export class ProductStore {
    private _products = signal<any[]>([]);
    readonly products = this._products.asReadonly();
    private http = inject(HttpClient);
    constructor() {
        this.loadProducts();
    }

    private loadProducts() {
        this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe((data) => {
            this._products.set(data);
        });
    }

}
```
In dit voorbeeld hebben we een `ProductStore` service die de productdata beheert. We gebruiken Angular's `HttpClient` om een GET-verzoek te doen naar de externe API en de ontvangen data op te slaan in een signal.
Nu kunnen we deze `ProductStore` gebruiken in een component om de producten weer te geven:

```typescript
// src/app/components/product-list/product-list.ts
import { Component } from '@angular/core';
import { ProductStore } from '../../services/product-store';
import { inject } from '@angular/core';
export class ProductList {
    products = this.productStore.products;
    private productStore = inject(ProductStore);
}
```
```html
<!-- src/app/components/product-list/product-list.html -->
<h2>Producten</h2>
<ul>
    @for (let product of products(); let i = $index; track i) {
        <li>{{ product.title }} - {{ product.price | currency }}</li>
    }
</ul>
```
Hier hebben we een `ProductList` component die de producten ophaalt uit de `ProductStore` en deze weergeeft in een lijst. De producten worden automatisch bijgewerkt in de UI zodra ze zijn geladen van de externe API.

:::info
We hebben hier gebruik gemaakt van de interface `Product` om de structuur van de productdata te definiëren. Dit helpt bij het type-checken en maakt de code duidelijker. Dit is optioneel maar aanbevolen bij het werken met externe data. De verschillende velden in de interface komen overeen met de eigenschappen die worden geretourneerd door de API.
:::

In plaats van zelf te subscriben op een observable, kun je de observable direct omzetten naar een signal met toSignal(). Angular zorgt er dan automatisch voor dat de signal wordt bijgewerkt wanneer er nieuwe waarden binnenkomen. Zo hoef je geen handmatige subscribe() te doen en vermijd je potentieel geheugenlekken.
```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private http = inject(HttpClient);

  readonly products = toSignal(
    this.http.get<Product[]>('https://fakestoreapi.com/products'),
    { initialValue: [] }
  );
}
```
:::warning
**Belangrijk:**
Dit werkt goed voor eenvoudige dataloading, zoals het ophalen van een lijst van producten bij het starten van een component.

Je krijgt hiermee geen controle over loading states, errors of herladen van data. Voor complexere scenario's is het beter om zelf te subscriben en de verschillende staten expliciet te beheren.

Het is dus ideaal als je slechts de laatste waarde van een asynchrone bron nodig hebt en je geen extra logica nodig hebt rond het laden of fouten afhandelen.
:::

### Feature-stores 
Bij grotere applicaties splitsen we de state op in feature-stores, waarbij elke store één domein beheert. Voorbeelden zijn een `AuthStore` voor gebruikersauthenticatie, een `ProductsStore` voor producten, of een `CartStore` voor winkelwagenitems.

Feature-stores kunnen elkaar injecteren zodat ze state of computed values kunnen delen. Dit maakt compositie van state mogelijk zonder alles in één grote store te stoppen.

```typescript
import { inject, Injectable } from '@angular/core';
import { CartStore } from './cart-store';
@Injectable({
  providedIn: 'root',
})
export class OrderStore {
    private cartStore = inject(CartStore);
    constructor() {}
    placeOrder() {
        const items = this.cartStore.items();
        // Verwerk de bestelling met de items uit de winkelwagen
        console.log('Order placed for items:', items);
        this.cartStore.clearItems(); // Leeg de winkelwagen na bestelling
    }
}
```
In dit voorbeeld hebben we een `OrderStore` die de `CartStore` injecteert om toegang te krijgen tot de winkelwagenitems. De `placeOrder` methode verwerkt de bestelling en leegt vervolgens de winkelwagen.

### Readonly en encapsulatie
In grote projecten draait alles om veiligheid en voorspelbaarheid. We willen voorkomen dat componenten of andere delen van de applicatie per ongeluk de state kunnen wijzigen op ongewenste manieren.
Door alleen readonly signals naar buiten te richten, zorgen we ervoor dat de state alleen kan worden aangepast via de methoden van de store zelf. Dit voorkomt dat er ergens in de code direct in de signal wordt geschreven, wat de integriteit van de data waarborgt.
Hier is een voorbeeld van hoe we dit toepassen in de `CartStore`:

```typescript
// src/app/services/cart-store.ts
import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private _items = signal<string[]>([]);
    readonly items = this._items.asReadonly(); // Enkel de readonly versie naar buiten richten
    addItem(item: string) {
        this._items.update((items) => [...items, item]);
    }
    removeItem(item: string) {
        this._items.update((items) => items.filter((i) => i !== item));
    }
    clearItems() {
        this._items.set([]);
    }
}
```
In dit voorbeeld is `_items` een privé signal die alleen binnen de `CartStore` kan worden aangepast. De `items` property is een readonly versie van deze signal, waardoor externe code alleen de huidige waarde kan lezen, maar niet kan wijzigen. Alle wijzigingen moeten via de methoden `addItem`, `removeItem` en `clearItems` gebeuren, wat zorgt voor een gecontroleerde en voorspelbare manier om de winkelwagenstate te beheren.


## 3. CRUD-operaties met Signals
CRUD staat voor Create, Read, Update en Delete - de vier basisoperaties voor het beheren van data. Met Angular Signals kunnen we deze operaties efficiënt uitvoeren binnen onze stores.

### Van State naar CRUD
Laten we een voorbeeld bekijken van een eenvoudige `TodoStore` die CRUD-operaties beheert voor een lijst van taken:
```typescript
// src/app/services/todo-store.ts
import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private _todos = signal<string[]>([]);
    readonly todos = this._todos.asReadonly();
    addTodo(todo: string) {
        this._todos.update((todos) => [...todos, todo]);
    }
    updateTodo(index: number, newTodo: string) {
        this._todos.update((todos) => {
            const updatedTodos = [...todos];
            updatedTodos[index] = newTodo;
            return updatedTodos;
        });
    }
    deleteTodo(index: number) {
        this._todos.update((todos) => todos.filter((_, i) => i !== index));
    }
}
```
In dit voorbeeld hebben we een `TodoStore` service die een lijst van taken beheert met behulp van signals. We hebben methoden voor het toevoegen, bijwerken en verwijderen van taken, wat de CRUD-operaties vertegenwoordigt.
:::info

```typescript
updateTodo(index: number, newTodo: string) {
    this._todos.update((todos) => {
        const updatedTodos = [...todos];
        updatedTodos[index] = newTodo;
        return updatedTodos;
    });
}
```
Merk op hoe we de `update()` methode gebruiken om de lijst van taken bij te werken. Dit zorgt ervoor dat we de bestaande lijst behouden en alleen de benodigde wijzigingen aanbrengen, wat efficiënter is dan het volledig vervangen van de lijst.

Wat hier achterliggend gebeurt is dat Angular eerst alle todos leest, vervolgens de array kopieert (`[...]`), en dan de specifieke wijziging toepast.
:::

### Persistentie van CRUD-data
Net zoals we eerder hebben gezien bij de winkelwagen, kunnen we persistentie toevoegen aan onze `TodoStore` door gebruik te maken van `localStorage`. We slaan de taken op telkens wanneer ze worden bijgewerkt en laden ze bij het initialiseren van de store:
```typescript
// src/app/services/todo-store.ts
import { Injectable, signal, effect } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TodoStore {
    private _todos = signal<string[]>(this.loadTodos());
    readonly todos = this._todos.asReadonly();
    constructor() {
        effect(() => {
            this.saveTodos(this._todos());
        });
    }
    addTodo(todo: string) {
        this._todos.update((todos) => [...todos, todo]);
    }
    updateTodo(index: number, newTodo: string) {
        this._todos.update((todos) => {
            const updatedTodos = [...todos];
            updatedTodos[index] = newTodo;
            return updatedTodos;
        });
    }
    deleteTodo(index: number) {
        this._todos.update((todos) => todos.filter((_, i) => i !== index));
    }
    private saveTodos(todos: string[]) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    private loadTodos(): string[] {
        const todos = localStorage.getItem('todos');
        return todos ? JSON.parse(todos) : [];
    }
}
```
In dit voorbeeld laden we de taken uit `localStorage` wanneer de `TodoStore` wordt gemaakt. We gebruiken een effect om de taken op te slaan in `localStorage` telkens wanneer ze veranderen. Hierdoor blijft de lijst van taken behouden, zelfs als de gebruiker de pagina herlaadt of de browser sluit.

:::info
In dit voorbeeld maken we gebruik van een `effect()` om de taken op te slaan in `localStorage` telkens wanneer de `_todos` signal verandert. Dit zorgt ervoor dat dit vanzelf wordt toegepast op al de CRUD-operaties (Create, Read, Update, Delete) die we hebben geïmplementeerd.

Je zou dit ook manueel kunnen aanroepen binnen elke CRUD-methode. Dit zou er dan als volgt uitzien:
```typescript
addTodo(todo: string) {
    this._todos.update((todos) => [...todos, todo]);
    this.saveTodos(this._todos());
}
```
Echter, door een effect te gebruiken, vermijden we duplicatie van code en zorgen we ervoor dat de persistentie automatisch wordt afgehandeld bij elke wijziging van de takenlijst.
:::


### CRUD met Async data
In een echte applicatie komt data vaak van een externe bron, zoals een backend API. We kunnen Angular Signals gebruiken om CRUD-operaties uit te voeren op asynchrone data binnen onze stores.
Laten we een voorbeeld bekijken van een `TodoStore` die CRUD-operaties uitvoert via een externe API:
```typescript
// src/app/services/todo-store.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TodoStore {
    private http = inject(HttpClient);
    private _todos = signal<string[]> ([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);
    readonly todos = this._todos.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    loadTodos() {
        this._loading.set(true);
        this.http.get<string[]>('https://api.example.com/todos').subscribe({
            next: (data) => {
                this._todos.set(data);
                this._error.set(null);
            },
            error: (err) => {
                this._error.set('Failed to load todos');
            },
            complete: () => {
                this._loading.set(false);
            },
        });

    }
    addTodo(todo: string) {
        this.http.post<string>('https://api.example.com/todos', { todo }).subscribe({
            next: (newTodo) => {
                this._todos.update((todos) => [...todos, newTodo]);
                this._error.set(null);
            },
            error: (err) => {
                this._error.set('Failed to add todo');
            },
        });
    }
    updateTodo(index: number, newTodo: string) {
        const todoId = this._todos()[index]; // Veronderstel dat elk todo-item een unieke ID heeft
        this.http.put<string>(`https://api.example.com/todos/${todoId}`, { todo: newTodo }).subscribe({
            next: (updatedTodo) => {
                this._todos.update((todos) => {
                    const updatedTodos = [...todos];
                    updatedTodos[index] = updatedTodo;
                    return updatedTodos;
                }); 
                this._error.set(null);
            },
            error: (err) => {
                this._error.set('Failed to update todo');
            },
        });
    }
    deleteTodo(index: number) {
        const todoId = this._todos()[index]; // Veronderstel dat elk todo-item een unieke ID heeft
        this.http.delete(`https://api.example.com/todos/${todoId}`).subscribe({
            next: () => {
                this._todos.update((todos) => todos.filter((_, i) => i !== index));
                this._error.set(null);
            },
            error: (err) => {
                this._error.set('Failed to delete todo');
            },
        });
    }
}
```
Dit voorbeeld is best groot, dus laten we het even opsplitsen:
- We hebben een `TodoStore` service die CRUD-operaties uitvoert via HTTP-aanvragen naar een externe API.
- We gebruiken signals om de lijst van taken (`_todos`), de laadstatus (`_loading`) en eventuele fouten (`_error`) bij te houden.
- Elke CRUD-methode maakt een HTTP-aanvraag en werkt de signalen bij op basis van het resultaat van die aanvraag.
Elke CRUD-operatie is volgens hetzelfde patroon opgebouwd:
```typescript
addTodo(todo: string) {
this.http.post<string>('https://api.example.com/todos', { todo }).subscribe({
    next: (newTodo) => {
        this._todos.update((todos) => [...todos, newTodo]);
        this._error.set(null);
    },
    error: (err) => {
        this._error.set('Failed to add todo');
    },
});
}
```
1. We doen een HTTP-aanvraag (in dit geval een POST-verzoek om een nieuwe taak toe te voegen).
2. In de `next` callback werken we de `_todos` signal bij met de nieuwe taak en resetten we eventuele fouten.
3. In de `error` callback stellen we een foutmelding in als de aanvraag mislukt.
4. Uiteindelijk in `complete` zetten we de laadstatus terug naar false. Dit wordt aangeroepen ongeacht of de aanvraag slaagt of faalt.

We verwerken ook de laadstatus en fouten, zodat de UI kan reageren op deze staten. Bijvoorbeeld, we kunnen een laadindicator tonen wanneer `_loading` true is, en een foutmelding weergeven als `_error` niet null is.
:::info
Herinner je nog de verschillende http-methoden?
- `GET`: Ophalen van data.
- `POST`: Creëren van nieuwe data.
- `PUT`: Bijwerken van bestaande data.
- `DELETE`: Verwijderen van data.

Deze methoden komen overeen met de CRUD-operaties die we in onze store implementeren.
- Create -> POST
- Read -> GET
- Update -> PUT
- Delete -> DELETE
:::

### Optimistic updates & rollbacks
In sommige gevallen willen we de UI direct bijwerken, voordat we een bevestiging van de server hebben ontvangen. Dit ziet er vaak vloeiender uit voor de gebruiker. Dit noemen we optimistic updates.
Laten we een voorbeeld bekijken van hoe we optimistic updates kunnen implementeren in onze `TodoStore`:
```typescript
updateTodo(index: number, newTodo: string) {
    const previousTodo = this._todos()[index];
    // Optimistic update: werk de UI direct bij
    this._todos.update((todos) => {
        const updatedTodos = [...todos];
        updatedTodos[index] = newTodo;
        return updatedTodos;
    });
    this.http.put<string>(`https://api.example.com/todos/${previousTodo}`, { todo: newTodo }).subscribe({
        next: (updatedTodo) => {
            // Bevestiging van de server ontvangen, niets meer te doen
            this._error.set(null);
        },
        error: (err) => {
            // Rollback: herstel de vorige waarde bij een fout
            this._todos.update((todos) => {
                const rolledBackTodos = [...todos];
                rolledBackTodos[index] = previousTodo;
                return rolledBackTodos;
            });
            this._error.set('Failed to update todo');
        },
    });
}
```
In dit voorbeeld voeren we een optimistic update uit door de taak direct bij te werken in de UI voordat we de serverrespons ontvangen. We slaan de vorige waarde op in `previousTodo`, zodat we deze kunnen herstellen als de serveraanvraag mislukt.
Als de serveraanvraag slaagt, hoeven we niets meer te doen omdat de UI al is bijgewerkt. Als de aanvraag echter faalt, voeren we een rollback uit door de vorige waarde te herstellen in de `_todos` signal.

### CRUD + `computed()`
We kunnen voor de Read-operatie ook gebruik maken van `computed()` signals om afgeleide waarden te berekenen op basis van de CRUD-data. Bijvoorbeeld, we kunnen een computed signal maken dat het aantal taken bijhoudt:
```typescript
import { computed } from '@angular/core';
readonly todoCount = computed(() => this._todos().length);
```
Hier hebben we een `todoCount` computed signal dat automatisch het aantal taken bijhoudt op basis van de `_todos` signal. Telkens wanneer de lijst van taken verandert (bijvoorbeeld door het toevoegen of verwijderen van een taak), wordt `todoCount` automatisch bijgewerkt.Dit maakt het eenvoudig om afgeleide waarden te beheren zonder handmatig de telling bij te houden.
