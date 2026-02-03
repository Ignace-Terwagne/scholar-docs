---
id: ict-arch-context
sidebar_label: 'Context'
sidebar_position: 1
title: 'Context'
---
In dit hoofdstuk schetsen we de basiscontext van Docker Swarm. We bespreken wat het verschil is tussen docker en Docker Swarm en hoe de architectuur van Docker Swarm is opgebouwd.

:::warning[belangrijk]
Dit hoofdstuk gaat ervan uit dat je al enige basiskennis hebt van Docker.
:::

## 1. Van Docker naar Docker Swarm
Zoals we al eerder hebben gezien, maakt docker het mogelijk om applicaties te verpakken in containers. Hierdoor kunnen we applicaties isoleren zorgen dat ze overal hetzelfde draaien, ongeacht de onderliggende infrastructuur.

We kijken even naar het volgende voorbeeld:
```mermaid
---
config:
  layout: dagre
  look: classic
  theme: mc
---
flowchart LR
    I["internet"] --> S["machine"]
    S --> DE["Docker engine"]
    DE --> C1["webserver"]
```
In dit voorbeeld draait er op een enkele machine een docker engine, waarop een webserver container draait. Deze machine kan een fysieke machine zijn, een virtuele machine in de cloud of zelfs je eigen laptop.

Stel je nu even voor dat we de webserver af en toe willen updaten. Als we dat op deze machine willen doen, moeten we de container stoppen, updaten en weer opnieuw starten. Hierdoor is er een korte downtime van de webserver. En stel je voor dat er tijdens een update iets misgaat, dan is de webserver helemaal niet meer beschikbaar.

We zouden dit kunnen oplossen door meerdere containers op dezelfde machine te draaien en dan zou het er zo uit kunnen zien:
```mermaid
---
config:
  layout: dagre
  look: classic
  theme: mc
---
flowchart LR
    I["internet"] --> S["machine"]
    S --> DE["Docker engine"]
    DE --> C1["webserver-1"]
    DE --> C2["webserver-2"]
    DE --> C3["webserver-3"]
```
Nu hebben we meerdere webservers op dezelfde machine draaien. Als we nu een update willen uitvoeren, kunnen we één voor één de containers updaten, waardoor er altijd minimaal één webserver beschikbaar blijft. Dit is al een stuk beter, maar het wordt wel al heel wat complexer om te beheren. We moeten nu namelijk bijhouden welke containers er draaien. Daarnaast lost dit het probleem ook niet volledig op, want wat als de machine zelf een update nodig heeft of crasht? Dan zijn alle webservers ineens niet meer beschikbaar.

Om deze problemen op te lossen, kunnen we Docker Swarm gebruiken. Docker Swarm stelt ons in staat om meerdere machines (**nodes**) te groeperen tot één enkele virtuele docker engine. Hierdoor kunnen we containers over meerdere machines verspreiden, wat zorgt voor meer beschikbaarheid en schaalbaarheid. Wanneer deze machines samenwerken, noemen we dit een **cluster**.
Ons voorbeeld zou er dan zo uit kunnen zien:
```mermaid
---
config:
  layout: dagre
---
flowchart LR
 subgraph Cluster["Docker Swarm / Cluster"]
        S1["node-1"]
        S2["node-2"]
        S3["node-3"]
        DE1["Docker engine"]
        DE2["Docker engine"]
        DE3["Docker engine"]
        C1["webserver-1"]
        C2["webserver-2"]
        C3["webserver-3"]
  end
  
    I["internet"] --> Cluster
    S1 <--> S2 & S3
    S2 <--> S3
    S1 --> DE1
    S2 --> DE2
    S3 --> DE3
    DE1 --> C1
    DE2 --> C2
    DE3 --> C3
```
Als we nu een update zouden willen uitvoeren, kunnen we één voor één de nodes updaten. Hierdoor blijft de webserver altijd beschikbaar, zelfs als een hele machine crasht. Hoe dit precies in zijn werk gaat, bespreken we in de volgende hoofdstukken.

