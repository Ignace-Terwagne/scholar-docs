---
id: ict-arch-theo-3
title: 3. Software architectuur en message queues
sidebar_label: 3. Software architectuur en message queues
sidebar_position: 3
unlisted: true
---

# 3. Software architectuur en message queues

In dit hoofdstuk gaan we kijken naar hoe software wordt opgebouwd en georganiseerd, hoe een softwarepakket schaalbaar kan worden gemaakt en welke rol message queues kunnen spelen in software architectuur.

### 1 Software architectuur
Software architectuur gaat niet over het schrijven van één specifiek programma, maar over het ontwerpen van een volledig systeem. Waar een developer zich op focust op code, focust de architect zich op het grotere plaatje: hoe worden onderdelen gedeployed, hoe communiceren ze en hoe blijft het systeem overeind onder zware druk.

:::info
Er wordt hier gesproken van een developer en een architect, maar in de praktijk kunnen deze rollen perfect door dezelfde persoon worden vervuld, zeker in kleinere teams.
:::

### 2. De 4 dimensies van software architectuur
Om een architectuur te begrijpen of te ontwerpen, kijken we naar vier dimensies:
#### Architecturale karakteristieken
Dit zijn de eigenschappen van een systeem. Er wordt vaak naar verwezen als de "ilities", zoals, scalability, reliability, maintainability, enz. Hierbij gaat het niet om wat een systeem doet, maar wel hoe het werkt en wat de niet functionele vereisten zijn.

#### Architecturale beslissingen
Dit zijn keuzes die gemaakt worden tijdens het ontwerpen van een systeem die een grote impact hebben op de architectuur. bijvoorbeeld: "We gebruiken altijd een SQL-database" of "Alle communicatie moet asynchroon zijn". Zulke beslissingen hebben een directe impact op hoe het systeem wordt gebouwd en onderhouden.

#### Logische componenten
Dit zijn de bouwstenen van een systeem. Zoals we bij de karakteristieken keken naar de niet-functionele vereisten, kijken we hier specifiek naar de functionele vereisten. Welke onderdelen heeft het systeem nodig om te functioneren en hoe kunnen die apart verdeeld worden? Denk hierbij aan "Gebruikersbeheer", "Betalingen", "Notificaties", enz.

### Archticturale stijlen
De architecturale stijl van een systeem is het algemeen bouwplan dat wordt gevolgd bij het ontwerpen van software.
Er zijn verschillende stijlen, zoals monolitisch (alles in één grote blok) en microservices (alles in kleine onafhankelijke services).

De keuze van de architecturale stijl wordt rechtstreeks bepaald door de architecturale karakteristieken en beslissingen. Bijvoorbeeld, als je een systeem wilt dat zeer schaalbaar is, zou je kunnen kiezen voor een microservices-architectuur. Aan de andere kant, als je een systeem wilt dat eenvoudig te onderhouden is, zou je kunnen kiezen voor een monolithische architectuur.

:::info
De termen "monolitisch" en "microservices" kunnen nog als onbekend klinken, maar hier gaan we verder dieper op in.
:::

### 3. Architectuur vs. Design
Architectuur en design zijn nauw verwant, maar ze zijn niet hetzelfde. We beschouwen de architectuur als een strategie. Deze wordt op voorhand bepaald en gaat over het ganse systeem. Het bepaalt ook de grenzen waarbinnen alles moet werken en elk stukje code moet zich aan deze regels houden.
De architecturale beslissingen vragen om veel werk en brengen significante trade-offs met zich mee. Elke keuze op dit niveau is een compromis; je ruilt bijvoorbeeld eenvoud in voor schaalbaarheid, of ontwikkelsnelheid voor robustheid.

Design daarentegen is meer tactisch. Het gaat over een specifiek onderdeel van het systeem. Het is meer flexibel en kan veranderen naarmate het systeem evolueert. Denk hierbij aan het ontwerp van een specifieke module of component binnen het grotere systeem. Omdat de designkeuzes lokaal blijven, vergen ze relatief weinig werk om aan te passen, naarmate de behoeften evolueren. De trade-offs bij design zijn minder ingrijpend omdat een verandering in één module meestal geen domino-effect heeft op de rest van het systeem, zolang de overkoepelende architecturale beslissingen worden gerespecteerd.

### 4. Greenfield vs. Brownfield
Bij het ontwerpen van software kunnen we te maken hebben met een "greenfield" omgeving of een "brownfield" omgeving. Een greenfield omgeving is een situatie waarin we een volledig nieuw systeem ontwerpen en bouwen, zonder rekening te houden met bestaande systemen of code. Dit geeft ons de vrijheid om de architectuur helemaal vanaf nul te bouwen, zonder beperkingen.

Aan de andere kant hebben we een brownfield omgeving, waarin we te maken hebben met bestaande systemen, code en infrastructuur. In dit geval moeten we rekening houden met de bestaande architectuur en beslissingen, en moeten we onze nieuwe ontwerpen aanpassen aan deze beperkingen. Dit kan het ontwerpproces complexer maken, omdat we niet zomaar kunnen kiezen voor de betere oplossing.

### 5. Casus - DigitAP
Laten we een voorbeeld nemen van een softwarepakket dat dagelijks gebruikt wordt: DigitAP, of ook wel moodle genoemd. 
| dimensie | toepassing |
| --- | --- |
| Architecturale karakteristieken | moet schaalbaar zijn voor duizenden studenten en het moet interoperabel zijn via standaarden zoals LTI. |
| Architecturale beslissingen | er wordt gebruik gemaakt van een SQL-database en de programmeertaal is PHP. Er wordt gebruik gemaakt van "PHP source files" voor de plugins. |
| Logische componenten | gebruikersbeheer, cursusbeheer, communicatie, notificaties, enz. |
| Architecturale stijl | modulair monolitisch. Er is één grote codebase, maar er zijn ook duidelijke modules en plugins die apart kunnen worden ontwikkeld en onderhouden. |

Aangezien DigitAP (moodle) al in ontwikkeling is sinds 2002, kunnen we stellen dat het een brownfield project is. Ondanks dat er ondertussen al veel interessantere architecturale stijlen zijn, zoals microservices of programmeertalen waarbij PHP niet meer de beste keuze is, kunnen we niet zomaar overstappen naar een nieuwe architectuur of programmeertaal. We moeten rekening houden met de bestaande codebase, de gebruikers en de ontwikkelaars die al vertrouwd zijn met de huidige architectuur.

### 6. non-domain design considerations
We maken ook een onderscheid tussen de functionele vereisten en de "non-domain design considerations". Om dit goed te begrijpen, moeten we eerst scherp stellen wat het doemin precies is.

Kort gezegd is het domein het gebied of context waarin we software ontwikkelen. Stel dat we software ontwikkelen voor een bank, dan is het domein de financiële sector. De functionele vereisten zijn de specifieke functies en features die het systeem moet hebben om aan de behoeften van de gebruikers te voldoen. De "non-domain design considerations" zijn bijvoorbeeld veiligheid, prestaties, schaalbaarheid, enz. Deze staan los van de sector waarin we werken.

### 7. Casus - Sillycon Symposia
We kijken naar een ander voorbeeld, namelijk Sillycon 

Symposia, een fictief bedrijf dat een technologieconferenties organiseert. Zij hebben ook een sociaal medium genaamd Lafter, waar sprekers en bezoekers kunnen communiceren.
```
De requirements voor Lafter zijn:
- Er moeten honderden sprekers en duizenden bezoekers actief kunnen zijn op het platform.
- Gebruikers moeten een account kunnen aanmaken
- Gebruikers moeten "jokes" (lange teksten) en "puns" (korte teksten) kunnen maken
- Gebruikers moeten berichten tot 281 tekens kunnen sturen
- Gebruikers moeten links kunnen posten
- Bezoekers moeten sprekers kunnen volgen
- Volgers moeten kunnen reageren met "Haha" of "Giggle" op berichten.
- Sprekers moeten een eigen icoontje hebben
- Sprekers moeten een forum kunnen opzetten over hun eigen topic

context:
Het platform moet beschikbaar zijn over verschillende landen. Er is een klein supportteam en er zijn tijdens de conferenties pieken in het gebruik. 
```
Dit is een typisch kort requirementsdocument. Het omvat zowel de functionele vereisten als de niet-functionele vereisten (de karakteristieken). 

Wat hier als context geformuleerd is, vertaalt vrij goed naar architecturale karakteristieken, zoals schaalbaarheid (omdat er pieken in het gebruik zijn tijdens de conferenties), beschikbaarheid (omdat het platform over verschillende landen beschikbaar moet zijn) en onderhoudbaarheid (omdat er een klein supportteam is).

Vaak wordt dit document opgesteld door business analisten. Software architecten gaan hier vervolgens mee aan de slag om de technische keuzes te maken die nodig zijn om aan de vereisten te voldoen en die worden uiteindelijk geïmplementeerd door developers.

We kunnen ook beschouwen als "non-domain design considerations" de volgende punten:
- Het platform moet veilig zijn, vooral omdat er gebruikersaccounts zijn en er persoonlijke informatie wordt gedeeld.
- Het platform moet snel zijn, vooral tijdens pieken in het gebruik.
- Het platform moet schaalbaar zijn, zodat het kan omgaan met een groot aantal gebruikers tijdens de conferenties.

Deze zijn niet expliciet vermeld in de requirements, maar ze zijn wel cruciaal voor het success van het platform en moeten dus ook in overweging worden genomen bij het ontwerpen van de architectuur.