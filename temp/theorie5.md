index.md 
# Architecturale stijlen

---

<table>
<tr><td colspan="2" style="border: none;"></td><th colspan="2" style="text-align: center">Partitionering</th></tr>
<tr><td colspan="2" style="border: none;"></td><th>Technisch</th><th>Op basis domein</th></tr>
<tr><th rowspan="2" style="writing-mode: sideways-lr; vertical-align: middle; border: none">Deployment</th><th style="writing-mode: sideways-lr">Monolitisch</th><td><ul><li>gelaagd</li><li>microkernel</li></ul></td><td>modulaire monoliet</td></tr>
<tr><th style="writing-mode: sideways-lr; border: none;">Gedistribueerd</th><td>event-driven</td><td>microservices</td></tr>
</table>

note:
- overzicht van de stijlen
- stijl zal bepalen hoe we componenten van eerder concreet gaan realiseren
- er bestaan er nog (bv. voor realtime systemen), maar deze zijn algemeen bruikbaar
- monolitisch in logische zin kan nog steeds fysiek verdeeld zijn, maar dat is wel minder vanzelfsprekend

---

- technische partitionering
  - presentatie
  - logica
  - persistentie
- partitionering op basis domein
  - klanten
  - betalingen
  - verzendingen

note:

- uiteraard maar voorbeelden, er bestaan middlewares en andere domeinen
- zowel in technische partitionering als in die op basis domein andere grenzen mogelijk

---

"Mag ik bij opdeling volgens domein geen opdeling in presentatie/logica/persistentie toepassen?"

note:
- Jawel! Maar dan is dat een implementatieaspect.
  - vaak weerspiegeld in namespacing: `app.presentation.customer` vs. `app.customer.presentation`
  - maakt een verschil: technische partitionering is goed als teams technische specialisaties hebben, domeinpartitionering als ze per team veel expertise over een deeldomein hebben

---

## Stijl: gelaagde architectuur
- technische partitionering
- monolitisch

---

## Case: Naan & Pop

note:
- website voor klein restaurant

---

## Requirements
- online bestellingen kunnen plaatsen
- snel online
- scheiding van technische onderdelen
- simpel (maar nog aanpasbaar)

note:
- zaak bestaat al, moeten snel iets hebben dat werkt
- gespecialiseerde IT-mensen die kunnen helpen (UI/logica/DB)
- **zullen op het einde laatste requirement niet 100% kunnen halen**

---

## Verband met MVC

![MVC](./afbeeldingen/mvc.png)

note:
- legt logica uit, maar zegt niet hoe we dit concreet realiseren in context van databases, browsers,...
- informele terminologie maakt dit minder duidelijk, kan misschien zelfs "MVC architecture" tegenkomen
- kan zijn dat een design pattern "tegenhanger" heeft op architecturaal niveau
  - kan bijvoorbeeld ook één terminalappje structureren volgens MVC

---

## Lagen in Django
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=20)
```

```html
{% extends "base.html" %}

{% block page_content %}
<h1>Projects</h1>
<div class="row">
{% for project in projects %}
    <div class="col-md-4">
        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">{{ project.title }}</h5>
                <p class="card-text">{{ project.description }}</p>
                <a href="{% url 'project_detail' project.pk %}"
                   class="btn btn-primary">
                    Read More
                </a>
            </div>
        </div>
    </div>
    {% endfor %}
</div>
{% endblock %}
```

```python
from django.shortcuts import render
from projects.models import Project

def project_index(request):
    projects = Project.objects.all()
    context = {
        "projects": projects
    }
    return render(request, "projects/project_index.html", context)
```

note:
- Python "batteries included" en "opinionated" web framework
  - in een "opinionated" framework als dit is architecturale stijl eigenlijk al vastgelegd
- Django spreekt over "model-view-template", waarin "view" betekent wat we meestal aanduiden met "controller" en "template" betekent wat we aanduiden met "view"
- een typische Django-applicatie heeft dus eigenlijk een gelaagde architectuur en op codeniveau vinden we een specifieke implementatie van MVC terug
- zaken als object-relationele mappers maken onderscheid tussen lagen (domain/persistence) wat moeilijker te zien

---

## Interactie met gebruiker (1)
![flow request en response](./afbeeldingen/request-response-layered-architecture.png)

note:
- normaal is er een presentatielaag
- gebruiker spreekt deze aan om iets te doen
- vloeit naar beneden door lagen en resultaten vloeien terug

---

## Interactie met de gebruiker (2)

```python
def UI_layer(request):
    data = request.get_data()
    return business_logic_layer_function(data) # terug naar gebruiker

def business_logic_layer_function(data):
    processed_data = process_data(data) # binnen deze laag
    return data_access_layer_function(processed_data) # terug naar UI layer

def data_access_layer_function(data):
    retrieve_data = retrieve_data(data) # bijvoorbeeld uit de database
    return retrieved_data # terug naar business logic layer
```

note:
- dus als we calls bekijken hebben we eerst allemaal pijlen in een richting
- dan komen we eerste return tegen
- en dan weer helemaal terug tot bij gebruiker
- we kunnen ook verwerken wat we van dieper gelegen laag terugkrijgen, hoeven niet letterlijk te returnen

---

## Opdeling logische componenten

- code wordt typisch georganiseerd per laag
- groepering per logische component hier secundair

note:
- heel typisch mapjes `models`, `controllers`, `views`
- oplossing: logische componenten behouden, maar verdelen over lagen
  - bv. `views.orders` en `controllers.orders` en `domains.orders`
- vereist dat we logische componenten opdelen in "entiteiten" (concepten uit het domein) en "workflows" (zaken die we zouden doen met die component)
- betekent **niet** dat we eerder werk weggooien: de logische componenten helpen het domein begrijpen, dus houd bij wat waar uit afgeleid is en blijf logische componenten updaten naarmate architectuur wijzigt

---

## Voorbeeld opdeling
![componenten als vertrekpunt](./afbeeldingen/logische-componenten-naan-pop-layered.png)
![mapping](./afbeeldingen/mapping-componenten-layered.png)
note:
- logische componenten zijn allemaal terug te vinden
- mapping varieert naargelang aard van oorspronkelijke component
  - bv. "deliver order" workflow komt van logische component met zelfde naam, heeft geen UI-tegenhanger
- code zal georganiseerd worden in folders zoals `workflow/manage_recipes.txt`

---

## Verschijningsvormen (fysieke architecturen)

![tweetraps](./afbeeldingen/tweetraps.png)
![drietraps](./afbeeldingen/drietraps.png)
![eentraps](./afbeeldingen/eentraps.png)

note:
- "monolitisch" slaat op hoe we er over denken, kan topologische spreiding zijn
- "tweetraps" ≠ "twee lagen"
- niet beperkt tot enkel deze lagen: kunnen er nog toevoegen waar ze gepast lijken
- fysieke architectuur heeft ook weer invloed op karakteristieken (bv. toch onderdelen die over netwerk moeten communiceren,...)

---

## Technische wijzigingen vs. domeinwijzigingen
- zijn vertrokken uit het domein
- lagen hebben domein technisch opgedeeld
- technische aanpassingen zijn relatief makkelijk
- domeinwijzigingen zijn ingrijpend

note:
dus niet ideaal als we veel **domein**wijzigingen verwachten

---

## Sterke en zwakke punten
- ✅ praktisch haalbaar
- ✅ performant
- ✅ handig voor technologiespecialisten
- ✅ goedkoop
- ❌ beperkt schaalbaar
- ❌ lastig aanpassingen te deployen
- ❌ spreiding domein
- ❌ kwetsbaar
- ❌ vrij lastig te testen*

note:
- per opdeling in trappen wijzigen karakteristieken een beetje
- kwetsbaar omdat het systeem in een keer faalt (en moeilijk te redeployen om ongeveer zelfde reden)
- lastig te testen omdat zaken verspreid zijn over domein, maar wel heel veel gebruikt dus er zijn veel technieken voor ontwikkeld die het iets praktischer maken

---

# C4-model

note:
- https://c4model.com/
- lichter dan full-scale UML (wat toch bijna niet correct toegepast wordt), beter dan "lines and boxes"
- betreft **fysieke** architectuur
- staat voor "context, containers, components, code"
  - "containers" is hier een breder begrip dan "Docker containers"
- uitgevonden door Simon Brown, geeft workshops rond diagrammen architectuur
  - site is ruim voldoende en geeft veel praktisch advies
- diagrammen moeten (over langere tijd) communicatie bevorderen

---

## typische diagrammen

<div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr)">
  <img src="./afbeeldingen/sketch-1.jpg">
  <img src="./afbeeldingen/sketch-2.jpg">
  <img src="./afbeeldingen/sketch-3.jpg">
  <img src="./afbeeldingen/sketch-4.jpg">
</div>

---

## hiërarchische view

<div style="display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr)">
  <img src="./afbeeldingen/map-1.jpg">
  <img src="./afbeeldingen/map-2.jpg">
  <img src="./afbeeldingen/map-3.jpg">
  <img src="./afbeeldingen/map-4.jpg">
  <img src="./afbeeldingen/diagram-level-1.png">
  <img src="./afbeeldingen/diagram-level-2.png">
  <img src="./afbeeldingen/diagram-level-3.png">
  <img src="./afbeeldingen/diagram-level-4.png">
</div>

[demo](https://c4model.com/example)

note:
- in het "ideale" geval inzoombaar tot op de code zelf
  - soms wel vereenvoudigingen weergave
- heel weinig symbooltjes,...
  - legende onder diagram
  - voldoende verklarende tekst
  - kleur, vorm,... heeft geen betekenis (tenzij opgenomen in legende)

---

### systeemcontext

note:
- "wat is de link tussen gebruikers, het systeem in kwestie en andere systemen"?

---

### containerdiagram

note:
- "container" = een applicatie of een datareservoir

---

### component diagram

note:
- "component" ≠ "logische component", dit gaat over fysieke implementatie die volgt op eerste analyse
- wel: deel van een applicatie dat we beschouwen als iets dat één API aanbiedt
  - "API" in de brede zin, niet alleen voor HTTP, eerder als "interface tot één logisch deel"
- minder essentieel

---

### code diagram

note:
- diagram dat aangeeft hoe zaken op codeniveau werken
- typisch voorbeeld: UML-klassendiagram (indien objectgeoriënteerd...)
- niet aangeraden dit met de hand op te stellen, kan makkelijk reverse engineeren (en misschien opkuisen)

---

### deployment diagram

note:
- "aanvullend", maar **belangrijker** dan component en code diagrammen
- beantwoordt vraag: "*hoe* runt dit?"
- staat nesting toe, bv. server → VM → container → JVM → applicatie zelf
- infrastructurele diensten mogen hier ook op (firewalls, DNS servers, load balancers,...)

---

## hulpmiddelen
- [abstractions](https://c4model.com/abstractions/container)
- [review checklist](https://c4model.com/diagrams/checklist)
- [FAQ](https://c4model.com/diagrams/checklist)
- [tools](https://c4model.com/tooling)

note:
- "abstractions": veel concrete voorbeelden over wat telt als "container", "component"
- structurizr is "officiële" tool, maar model is onafhankelijk

---

### te kennen/gebruiken
- betekenis van de 4 abstracties
- notatie voor de eerste 3 abstracties
- deployment diagram
- uitleg queues en topics
- (later) toepassing op microservices

note:
- elke tool is goed
- structurizr is meest volledig maar is wel wat complexer
  - is wel "AI-friendly"
