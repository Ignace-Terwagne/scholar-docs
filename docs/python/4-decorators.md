---
id: python-theo-4
title: 4. Decorators in Python
sidebar_label: 4. Decorators in Python
---
In dit hoofdstuk behandelen we decorators in Python, een krachtig hulpmiddel om de functionaliteit van functies en methoden uit te breiden zonder hun broncode te wijzigen. We bespreken wat decorators zijn, hoe ze werken, en geven voorbeelden van het gebruik ervan.

## 1. Wat zijn Decorators
Decorators zijn speciale functies die andere functies als argumenten nemen en een nieuwe functie retourneren die de oorspronkelijke functie uitbreidt of wijzigt. Ze worden vaak gebruikt om herbruikbare functionaliteit toe te voegen, zoals logging, toegangscontrole, of caching.
In Python worden decorators aangeduid met het `@`-symbool boven de functie die ze decoreren.

## 2. Hogere Orde Functies
Een hogere orde functie is een functie die een andere functie als argument neemt of een functie retourneert.
Je kan het zien als een soort fabriek die functies maakt of aanpast.
Decorators zijn een voorbeeld van hogere orde functies.

Stel dat we de volgende eenvoudige functies hebben om oppervlaktes te berekenen:
```python
def vierkant(x):
    return x * x

def cirkel(r):
    return 3.14 * r * r

```
Dit zijn gewone functies. Ze nemen getallen als input en geven getallen terug als output.

Stel dat ons programma oppervlakten van verschillende vormen moet berekenen.
We hebben functies zoals `vierkant` en `cirkel`.

Als we bij elke berekening moeten controleren welke vorm het is, wordt de code rommelig:
```python
if vorm == 'vierkant':
    resultaat = vierkant(5)
elif vorm == 'cirkel':
    resultaat = cirkel(5)
```
In plaats daarvan maken we gebruik van een functie die de juiste functie teruggeeft op basis van de vorm:
```python
def oppervlakte_berekenen(type_vorm):
    if type_vorm == 'vierkant':
        return vierkant
    elif type_vorm == 'cirkel':
        return cirkel
```
Nu kunnen we de juiste functie ophalen op basis van de vorm die we willen berekenen:
```python
vorm = oppervlakte_berekenen('cirkel')
resultaat = vorm(5)  # Dit roept cirkel(5) aan
print(resultaat)  # Output: 78.5
```
Op dit moment lijkt het misschien wat omslachtig, maar stel bijvoorbeeld dat we aan de gebruiker vragen welke vorm ze willen berekenen. We kunnen dan eenvoudig de juiste functie ophalen en aanroepen zonder dat we overal in onze code hoeven te controleren welke vorm het is.
```python
vorm_naam = input("Welke vorm wil je berekenen (vierkant/cirkel)? ")
vorm = oppervlakte_berekenen(vorm_naam)
waarde = float(input("Geef de waarde in (zijde/radius): "))
resultaat = vorm(waarde)
print(f"De oppervlakte is: {resultaat}")
```
Nu moeten we niet bij elke gebruikersinvoer controleren welke vorm het is. We halen gewoon de juiste functie op en roepen die aan.
## 3. Het concept van Decorators
Een decorator is dus een toepassing van hogere orde functies.
Wat een decorator doet is:
1. Het neemt een functie als input.
2. Het maakt een nieuwe functie aan
3. Het voegt extra functionaliteit toe aan die nieuwe functie.
4. Het retourneert die nieuwe functie.

Laten we een eenvoudige decorator maken die bijhoudt hoe vaak een functie is aangeroepen:
```python
def echo(func):
    def wrapper():
        print(f"Functie {func.__name__} is aangeroepen")
        return func()
    return wrapper

def zeg_hallo():
    print("Hallo!")

zeg_hallo = echo(zeg_hallo)
zeg_hallo()
# Output: Functie zeg_hallo is aangeroepen
#         Hallo!
```
In dit voorbeeld hebben we een decorator `echo` gemaakt die een functie als argument neemt. Binnen de decorator definiëren we een nieuwe functie `wrapper` die eerst een bericht afdrukt en vervolgens de oorspronkelijke functie aanroept. De decorator retourneert de `wrapper`-functie.

Python biedt een handige syntaxis om decorators toe te passen met het `@`-symbool:
```python
def echo(func):
    def wrapper():
        print(f"Functie {func.__name__} is aangeroepen")
        return func()
    return wrapper

@echo
def zeg_hallo():
    print("Hallo!")
```
Dit doet exact hetzelfde als hiervoor. Wanneer we nu `zeg_hallo()` aanroepen, wordt de `wrapper`-functie uitgevoerd:
```python
zeg_hallo()
# Output: Functie zeg_hallo is aangeroepen
#         Hallo!
```
## 4. Functies met Argumenten
Soms wil je een decorator maken die functies met argumenten kan decoreren. Hiervoor moet de `wrapper`-functie dezelfde parameters accepteren als de oorspronkelijke functie. We kunnen dit doen met behulp van `*args` en `**kwargs`:
```python
def echo(func):
    def wrapper(*args, **kwargs):
        print(f"Functie {func.__name__} is aangeroepen met args: {args} en kwargs: {kwargs}")
        return func(*args, **kwargs)
    return wrapper

@echo
def zeg_hallo(naam):
    print(f"Hallo, {naam}!")

zeg_hallo("Alice")
# Output: Functie zeg_hallo is aangeroepen met args: ('Alice',) en kwargs: {}
#         Hallo, Alice!
```
In dit voorbeeld accepteert de `wrapper`-functie willekeurige argumenten en sleutelwoordargumenten, waardoor het mogelijk is om functies met verschillende parameters te decoreren.

## 5. Decorators met Argumenten
Soms wil je een decorator maken die zelf ook argumenten accepteert. Hiervoor moet je een extra laag van functies toevoegen:
```python
def herhaal(aantal):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(aantal):
                func(*args, **kwargs)
        return wrapper
    return decorator

@herhaal(3)
def zeg_hallo(naam):
    print(f"Hallo, {naam}!")
zeg_hallo("Bob")
# Output: Hallo, Bob!
#         Hallo, Bob!
#         Hallo, Bob!
```
In dit voorbeeld hebben we een decorator `herhaal` gemaakt die een argument `aantal` accepteert. Deze decorator retourneert een andere decorator die de oorspronkelijke functie meerdere keren aanroept.

## 6. Gebruik van `functools.wraps`
Wanneer je een decorator maakt, zal je merken dat de naam en docstring van de oorspronkelijke functie verloren gaan.
```python
def echo(func):
    def wrapper(*args, **kwargs):
        print(f"Functie {func.__name__} is aangeroepen")
        return func(*args, **kwargs)
    return wrapper

@echo
def zeg_hallo():
    """Zegt hallo tegen de gebruiker."""
    print("Hallo!")
print(zeg_hallo.__name__)  # Output: wrapper
print(zeg_hallo.__doc__)   # Output: None
```
Om dit op te lossen, kun je `functools.wraps` gebruiken, wat de metadata van de oorspronkelijke functie behoudt:
```python
import functools
def echo(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Functie {func.__name__} is aangeroepen")
        return func(*args, **kwargs)
    return wrapper
```
Hierdoor behoudt `zeg_hallo` zijn oorspronkelijke naam en docstring:
```python
print(zeg_hallo.__name__)  # Output: zeg_hallo
print(zeg_hallo.__doc__)   # Output: Zegt hallo tegen de gebruiker.
```
