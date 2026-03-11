# Karakteristieken

note:
- Was één van de dimensies (karakteristieken, beslissingen, componenten, stijl)
- Reminder: **hoe**, niet **wat**
  - "niet-functionale vereisten" ‡ "minder belangrijk"
- Selecteer en verantwoord eerst
  - Vuistregel: 7 (niet te veel, niet te weinig)
    - Je kan ze niet allemaal kiezen. Quote: "Good, cheap, fast. Pick any two."
    - Gelijkaardig: kies niet de vaagste, bv. "performance", wees precies, bv. "responsiveness"
    - Eventueel kan je er nog paar aanduiden als "allerbelangrijkst"
- [Lijst met voorbeelden](https://en.wikipedia.org/wiki/List_of_system_quality_attributes)
  - niet universeel of definitief
    - paradigma's wijzigen, vroeger was "availability" geen concept
  - sommige gaan makkelijker samen dan andere (bv. security ↔ convenience)

---

## Voor Sillycon Symposia

<div style="display: flex; font-size: 80%">
  <div>
    <ul>
      <li>account aanmaken</li>
      <li>"jokes" en "puns" maken</li>
      <li>berichten tot 281 karakters posten</li>
      <li>links posten</li>
      <li>"Haha" of "Giggle" reageren</li>
      <li>een eigen icoontje</li>
      <li>sprekers kunnen een forum opzetten over hun eigen topic</li>
      <li>ondersteuning voor internationaal gebruik</li>
      <li>kleine support staff</li>
      <li>pieken in verkeer (tijdens conferenties)</li>
    </ul>
  </div>
  <div>
    <ul>
      <li>scalability (veel users)</li>
      <li>elasticity (pieken)</li>
      <li>integrity (accounts bepalen ownership)</li>
      <li>internationalization (zie context)</li>
      <li>customizability (aanmaak forums, icoontjes)</li>
      <li>fault tolerance (kleine support staff)</li>
    </ul>
  </div>
</div>

note:

- Factoren als "kleine support staff" hebben invloed op gewenste eigenschappen, context is belangrijk
- Breng in kaart **zonder** al over implementatie te speculeren
- Customizability is beetje koepelterm voor functionaliteit, maar gaat niet over die specifieke zaken, eerder over ingebakken niveau flexibiliteit

---

## Documenteren

<table>
<tr><th>Karakteristiek</th><th>Expliciet?</th><th>Top 3?</th></tr>
<tr><td>Scalability</td><td>Ja</td><th>Ja</th></tr>
<tr><td colspan="3">...</td></tr>
<tr><td>Fault tolerance</td><td>Nee</td><th>Ja</th></tr>
</table>

---

# Architecturale beslissingen

note:

- ook een van de vier dimensies
- worden genomen in functie van gewenste karakteristieken
  - kies bv. geen taal met automated garbage collection als voorspelbare performance belangrijk is,...

---

## Tweede wet

**Why** is more important than **how**.

note:

- "how" is simpel ⇒ kijk naar de code

---

## ADR's

note:

- architectural decision records
- ± standaard om beslissingen bij te houden 
- ook vorm van developer documentatie

---

- één per architecturale beslissing
- gestructureerd
- geen "user-facing" docs
- append-only
- best plain text
- typisch per project
- neutrale toon

---

### Mogelijke template
- title
- status
- context
- decision
- consequences
- governance
- notes

note:
- titel: op één regel
  - nummer in titel: best opvullen met nullen om makkelijk te lezen
- RFC = request for comment, proposed = intern bekeken maar moet verder goedgekeurd worden, zie toestandsdiagram volgende slide, "accepted" of "superseded by (later ADR)"
- context: alle factoren om in rekening te brengen, zonder beslissing zelf
- decision: de gemaakte keuze, kordaat uitgedrukt, samen met **objectieve** verantwoording
  - mag wel zaken omvatten als "development team heeft ervaring met..."
  - geen zaken zoals "programmeertaal X is slecht ontworpen"
- consequences: wat wordt (on)mogelijk, welk werk ontstaat of valt weg,...
- governance: hoe wordt de beslissing opgevolgd?
  - bv. bewustmaking bij developers/klanten, audits,...
- notes: extra aantekeningen, kan hier bv. metadata in plaatsen (maar dat kan eventueel ook via versiebeheer)

---

### Toestandsdiagram

<div class="mermaid">
stateDiagram-v2
    state if_state_1 &lt;&lt;choice&gt;&gt;
    state if_state_2 &lt;&lt;choice&gt;&gt;
    [*] --> RFC
    RFC --> if_state_1
    if_state_1 --> Accepted
    if_state_1 --> Proposed: overleg met anderen nodig
    Proposed --> Accepted
    Accepted --> if_state_2
    if_state_2 --> Superseded: nieuwe informatie maakt ADR niet meer van toepassing
    Superseded --> [*]
</div>

---

- Title: 012: Gebruik van queues voor asynchrone messaging vanaf tradingdienst
- Status: Accepted
- Context: De trading service moet andere diensten (voorlopig: analytics en notifications) op de hoogte brengen van nieuwe producten en van elke verkoop. Dit kan via web services (REST e.d.) of via asynchrone messaging (queues of topics).
- Decision: **We zullen queues gebruiken.** Queues maken het systeem veelzijdig, aangezien elke queue andere soorten berichten kan afleveren. Ze maken het systeem ook veiliger aangezien de trading service steeds weet wie de queues uitleest.
- Consequences: De koppeling tussen diensten zal hoger zijn, want elke nieuwe queue moet ondersteund worden door de trading service. We zullen ook infrastructuur voor de queues moeten voorzien.

---

[extra tools voor ADR](https://adr.github.io/#decision-capturing-tools)

---

# Logische componenten

note:

- vergelijk met de kamers in een huis
- verschillende "onderdelen" van een systeem, **los van code**
  - niet "een Docker container voor...", "een controller", "een (micro)service",...
    - eerder een subsysteem met een bepaalde verantwoordelijkheid
    - **kan** trouwens niet als we geen architecturale stijl hebben

---

## Stap 1: Initiële kerncomponenten

- 2 technieken
  - workflow
  - actor/action
- mogen beide toepassen

note:
- eerst "raden", we zullen iteratief verfijnen
- zowel workflow als actor/action bieden een kader voor dat raden
- in sommige settings is de een natuurlijker dan de ander

---

### Workflow approach
- perspectief van een gebruiker
- conceptuele stappen van één "user journey"
- verschillende stappen ⇒ verschillende componenten
  - niet nodig voor sterk verwante stappen
  - omgekeerd: één stap kan meerdere aspecten bevatten en dus beter over meerdere componenten verdeeld worden

note:
- user journey: één "typisch gebruik" van het systeem
- smileys in Mermaid zijn hier niet relevant

---

<div class="mermaid">
journey
  title "Meedoen en winnen"
  Registreren voor de veiling:3:Bieder
  Aanmelden bij de start:3:Bieder
  Veiling bekijken:3:Bieder
  Bod plaatsen:3:Bieder
  Betalen:3:Bieder
</div>

note:
- "user journey" wordt veel gebruikt voor verbetering UX, smileys geven "ervaring" weer, hier niet relevant, maar is zo in Mermaid
- kunnen stappen mappen op logische componenten
- **kan** dat twee stappen onder zelfde component vallen

---

#### Namen

- Auction Registration
- Live Auction Session
- Video Streamer
- Bid Capture
- Automatic Payment

---

### Actor/action approach
- handig bij meerdere soorten gebruikers
- sommen **belangrijkste** handelingen op
- verbinden deze met componenten
- verbinden ook componenten onderling
- "system" actor voor automatische acties

---

![actor action uit boek](./afbeeldingen/actoraction.png)

---

<div class="mermaid">
sequenceDiagram
  actor Kate
  actor Sam
  actor System
  participant AuctionSearch
  participant VideoStreamer
  participant BidCapture
  participant LiveAuctionSession
  participant AutomaticPayment
  participant BidderTracker

  Kate->>AuctionSearch: Look for an auction
  Kate->>VideoStreamer: View the live video stream
  Kate->>BidCapture: Place a bid

  Sam->>BidCapture: Receive a bid from an online bidder
  Sam->>BidCapture: Enter a live in-person bid into the system
  Sam->>LiveAuctionSession: Start the auction
  Sam->>LiveAuctionSession: Mark an item as sold

  System->>AutomaticPayment: Charge bidder
  System->>BidderTracker: Track bidder activity

  BidCapture->>BidderTracker: Forward bid
  LiveAuctionSession->>AutomaticPayment: Tell who to charge
  LiveAuctionSession->>BidderTracker: Start/stop tracking
</div>

note:
- **dit is niet het typische gebruik van een sequence diagram!**
  - daarin moet je van boven naar onder lezen als één reeks stappen met tijd tussen
- maar het toont wel "actors", componenten en communicatie
  - dus hier is geen component "tijd"!
- je mag dit van mij zelf ook gebruiken, als je duidelijk bent over de interpretatie

---

#### Entity Trap

- component met twee verantwoordelijkheden
- extra risico bij vage naamgeving
  - "supervisor"
  - "manager"
  - "control center"
  - ...

---

### Combineren
- identificeer actors en primaire acties zoals in actor/action
- doorloop dan acties zoals in workflow
- kunnen zo meer in detail gaan indien zinvol

note:
- dit is een **optie**, geen verplichting

---

## Stap 2: Requirements toewijzen aan componenten

![toewijzen requirements](./afbeeldingen/toewijzen-requirements.png)

note:
- betreft functionele requirements
- kan zijn dat component nog communiceert met andere, maar elke requirement zou een "thuis" moeten krijgen
- kan zijn dat we iets niet kunnen plaatsen en nieuwe component opmerken

---

## Stap 3: Rol en verantwoordelijkheden analyseren

- per component vraag stellen: "welke taken?"
- interne samenhang van een component = "cohesie"
  - hoe duidelijker het takenpakket, hoe hoger de cohesie
- moet opgevolgd worden naarmate systeem groeit
  - kan introductie nieuwe componenten noodzakelijk maken
    - kan bijhouden in een ADR!
- onthoud: **mik op sterke cohesie**

---

## Stap 4: Architecturale karakteristieken analyseren
- kijken hier naar de "driving characteristics"
- bekijken of de takenverdeling deze ondersteunt
- hier wel idee van fysieke implementatie nodig
  - moet convergeren wat betreft eerste beslissingen, componenten en stijl

---

### Voorbeeld (1)

driving characteristics:

- scalability
- availability
- performance

---

### Voorbeeld (2)

![situatie voor](./afbeeldingen/analyseren-karakteristieken-voor.png)

---

### Voorbeeld (3)

![situatie na](./afbeeldingen/analyseren-karakteristieken-na.png)

note:
- bid capture hoeft niet elk bod bij te houden, eigenlijk gewoon hoogste bod of hoogste paar "in memory"
  - volledige geschiedenis is belangrijk te hebben, maar geen reden om veiling te vertragen
- hier zou asynchrone messaging, bv. met RabbitMQ van pas kunnen komen

---

## Interactie tussen componenten

note:
Apart aspect. Componenten kunnen zelf intern goed zitten, maar communciatie onderling moet ook bekeken worden. We spreken hier over "koppeling"

---

## Afferente koppeling

note:
- Nederlands: aantal inkomende pijlen
  - pijl betekent "start is afhankelijk van einde"
- Engels: "fan-in", "incoming coupling", "afferent coupling" (CA)

---

![afferente koppeling](./afbeeldingen/afferent-coupling.png)
note:
- we zeggen hier dat de CA van Bidder Profile 2 bedraagt
- kunnen pijlen van actions mee beschouwen (gebeurt ook in boek)

---

## Efferente koppeling

note:
- Nederlands: aantal uitgaande pijlen
- Engels: "fan-out", "outgoing coupling", "efferent coupling" (CE)

---

![efferente koppeling](./afbeeldingen/efferent-coupling.png)

---

## Koppeling meten
- per component afferente, efferente en totale (som) koppeling
- ook totale koppeling van het systeem (som van sommen)

---

## Wet van Demeter

note:
- ook "principle of least knowledge"
  - mensen van CSC kennen gelijkaardig "least privilege"
- staat symbool voor "losse koppeling"
- [uitleg](https://en.wikipedia.org/wiki/Law_of_Demeter)
  - moeilijk exacte details te vinden, maar losse koppeling is de kern!

---

### Toegepast (1)

![sterke-koppeling](./afbeeldingen/high-coupling.png)

note:
- merk op wat er staat: de componenten op zich hebben goed afgebakende verantwoordelijkheden, i.e. sterke cohesie
- maar toch een ervan heeft ook opvallend sterke koppeling

---

### Toegepast (2)

![zwakke-koppeling](./afbeeldingen/low-coupling.png)

note:
- draait niet gewoon om de som, maar om goede balans
- te vaag? in statistiek zijn er spreidingsmaten zoals [standaarddeviatie](https://www.calculator.net/standard-deviation-calculator.html)
  - lager = minder afwijkingen ten opzichte van het gemiddelde
  - dus bij twijfel of spreiding beter is: mik op zelfde som en lagere SD
---

### Toegepast (3)
<div style="display: flex; flex-direction: column">
<img src="./afbeeldingen/high-coupling.png"></img>
<img src="./afbeeldingen/low-coupling.png"></img>
</div>

note:
- Twee componenten zijn gekoppeld als aanpassing aan de ene een aanpassing in de andere zou kunnen vereisen.
- Let op: geen spelletje diagrammen en getalwaarden optimaliseren. Lijkt het implementeerbaar?
