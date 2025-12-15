---
id: py-theo-3
title: 3. Inleiding tot Flask
sidebar_label: 3. Inleiding tot Flask
---

In dit hoofdstuk maken we kennis met Flask, een populair webframework voor Python. We behandelen de basisprincipes van Flask, hoe je een eenvoudige webapplicatie kunt maken, en enkele van de belangrijkste functies en concepten die je moet kennen om aan de slag te gaan met Flask.

## 1. Wat is Flask
Flask is een lichtgewicht webframework voor Python. Het is ontworpen om eenvoudig en uitbreidbaar te zijn, waardoor ontwikkelaars snel webapplicaties kunnen bouwen met minimale inspanning. Het is populair voor kleine tot middelgrote projecten en biedt flexibiliteit om alleen de componenten te gebruiken die je nodig hebt.

## 2. Waarom Flask?
Flask is simpel en flexibel. Hierdoor geeft  het ontwikkelaars vrijheid om hun applicaties op hun eigen manier te structureren. Het is ook gemakkelijk uitbreidbaar met verschillende extensies. Tot slot is flask ideaal voor beginners, omdat het een lage instapdrempel heeft en een duidelijke documentatie biedt.

## 3. Installatie van Flask
Je kunt Flask installeren met pip. Het is aan te raden om een virtuele omgeving te gebruiken om afhankelijkheden gescheiden te houden.
```bash
pip install Flask
```
## 4. Een eenvoudige Flask-applicatie
Hier is een eenvoudig voorbeeld van een Flask-applicatie:
```python
from flask import Flask
app = Flask(__name__)
@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld importeren we de Flask-klasse, maken we een applicatie-instantie en definiëren we een route die reageert op HTTP-verzoeken naar de root-URL ('/'). Wanneer deze route wordt bezocht, retourneert de functie `hello_world` de tekst 'Hello, World!'.

:::info
We gebruiken de variabele `__name__` om de applicatie te initialiseren. Deze variabele bevat de naam van het huidige Python-bestand en helpt Flask te bepalen waar het de applicatie moet zoeken.
Dit is vooral handig wanneer je de applicatie later uitbreidt met meerdere modules.
:::

Om de applicatie uit te voeren, sla je de code op in een bestand genaamd `app.py` en voer je het volgende commando uit in de terminal:
```bash
python app.py
```
Je krijgt dan een bericht dat de server draait
```bash
> python test.py
 * Serving Flask app 'test'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```
Je kunt nu je webbrowser openen en naar [http://127.0.0.1:5000](http://127.0.0.1:5000) gaan om de boodschap 'Hello, World!' te zien.

## 5. Routes en URL's
in Flask kan je routes definiëren met de `@app.route` decorator. Dit koppelt een URL-pad aan een Python-functie die wordt uitgevoerd wanneer die URL wordt bezocht. Je kunt ook variabelen in de URL opnemen door ze tussen `< >` te plaatsen.

```python
from flask import Flask
app = Flask(__name__)
@app.route('/home')
def home():
    return 'Welcome to the Home Page!'

if __name__ == '__main__':
    app.run()
```

:::info
We spreken hier van decorators. Dit zijn functies die andere functies aanpassen of uitbreiden. In het volgende hoofdstuk zullen we hier dieper op ingaan. Voorlopig is het voldoende om te weten dat een decorator start met een `@`-teken, gevolgd door de naam van de decorator en eventuele argumenten.
:::

In dit voorbeeld hebben we een nieuwe route `/home` toegevoegd die de functie `home` aanroept wanneer deze URL wordt bezocht. De functie retourneert de tekst 'Welcome to the Home Page!'.
Je kunt de applicatie opnieuw uitvoeren en naar [http://127.0.0.1:5000/home](http://127.0.0.1:5000/home) gaan om de nieuwe boodschap te zien.

## 6. Dynamische routes
Soms wil je voor verschillende gebruikers of items verschillende inhoud tonen. We gaan dan niet voor elke gebruiker of item een aparte route maken, dit zou heel snel onoverzichtelijk worden. In plaats daarvan gebruiken we dynamische routes met variabelen.
```python
from flask import Flask
app = Flask(__name__)
@app.route('/user/<username>')
def show_user_profile(username):
    return f'User: {username}'

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we een route `/user/<username>` gemaakt. Wanneer deze route wordt bezocht, wordt de waarde van `username` uit de URL gehaald en doorgegeven aan de functie `show_user_profile`. De functie retourneert vervolgens een boodschap met de gebruikersnaam.
Je kunt de applicatie opnieuw uitvoeren en naar [http://127.0.0.1:5000/user/Alice](http://127.0.0.1:5000/user/Alice) gaan om de boodschap 'User: Alice' te zien. Vervang 'Alice' door elke andere naam om verschillende gebruikers te testen.

## 7. HTTP-methoden
Standaard reageren routes op `GET`-verzoeken, maar je kunt ook andere HTTP-methoden zoals `POST`, `PUT` en `DELETE` gebruiken. Dit is vooral handig voor het bouwen van API's.
```python
from flask import Flask, request
app = Flask(__name__)
@app.route('/submit', methods=['POST'])
def submit():
    return 'Form submitted!'

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we een route `/submit` gemaakt die alleen reageert op `POST`-verzoeken. Wanneer een `POST`-verzoek naar deze route wordt gestuurd, retourneert de functie `submit` de boodschap 'Form submitted!'.
Deze route kan je niet direct in de browser testen. Je zal merken dat je een foutmelding krijgt `Method Not Allowed`. Gebruik hiervoor een tool zoals Postman of cURL om een `POST`-verzoek naar [http://127.0.0.1:5000/submit](http://127.0.0.1:5000/submit) te sturen.
Je kunt bijvoorbeeld cURL gebruiken in de terminal:
```bash
curl -X POST http://127.0.0.1:5000/submit
```
Dit zou de boodschap 'Form submitted!' moeten retourneren.

:::info
**HTTP-methoden**

HTTP-methoden zijn acties die aangeven wat je wilt doen met een bepaalde resource op een webserver. In principe kan je eendert welke HTTP-methode gebruiken of zelfs je eigen methoden definiëren, maar de gestandaardiseerden methoden zijn:
- `GET`: Ophalen van gegevens.
- `POST`: Verzenden van gegevens naar de server.
- `PATCH`: Gedeeltelijk bijwerken van bestaande gegevens.
- `PUT`: Volledig bijwerken van bestaande gegevens.
- `DELETE`: Verwijderen van gegevens.

Soms worden bepaalde methoden gecombineerd, zoals `PUT` en `PATCH`, afhankelijk van de specifieke behoeften van de applicatie.
:::

## 8. HTML weergeven
Flask kan ook HTML-pagina's weergeven in plaats van alleen platte tekst. De meest simpliste manier om dit te doen is door HTML rechtstreeks in de return-waarde van een route te plaatsen.
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<p>Hello, World!</p>'

if __name__ == '__main__':
    app.run()
```

## 9. Templates
Voor complexere HTML-pagina's is het beter om templates te gebruiken. Flask maakt gebruik van het Jinja2-template-engine, waarmee je dynamische HTML-pagina's kunt maken.
Eerst moet je een map genaamd `templates` aanmaken in dezelfde directory als je Flask-applicatie. Vervolgens maak je een HTML-bestand aan, bijvoorbeeld `index.html`, in de `templates`-map:
```html
<!-- templates/index.html -->
<!doctype html>
<html>
  <head>
    <title>My Flask App</title>
  </head>
  <body>
    <h1>Hello, {{ name }}!</h1>
  </body>
</html>
```
Vervolgens pas je je Flask-applicatie aan om deze template te gebruiken:
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/<name>')
def hello(name):
    return render_template('index.html', name=name)

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld gebruiken we de `render_template`-functie om de `index.html`-template weer te geven. We geven ook een variabele `name` door aan de template, die in de HTML wordt weergegeven met `{{ name }}`.
Je kunt de applicatie opnieuw uitvoeren en naar [http://127.0.0.1:5000/Alice](http://127.0.0.1:5000/Alice) gaan om de boodschap 'Hello, Alice!' te zien. Vervang 'Alice' door elke andere naam om de dynamische inhoud te testen.

## 10. Flask Forms
Flask biedt via de templates ook de mogelijkheid om formulieren te maken en te verwerken. Hier is een eenvoudig voorbeeld van hoe je een formulier kunt maken en de gegevens ervan kunt verwerken.
Eerst maken we een HTML-formulier in een template:
```html
<!-- templates/form.html -->
<!doctype html>
<html>
  <head>
    <title>Flask Form</title>
  </head>
  <body>
    <h1>Submit Your Name</h1>
    <form method="POST" action="/submit">
      <input type="text" name="name" placeholder="Enter your name">
      <input type="submit" value="Submit">
    </form>
  </body>
</html>
```
Vervolgens maken we een route in onze Flask-applicatie om het formulier weer te geven en de gegevens te verwerken:
```python
from flask import Flask, render_template, request
app = Flask(__name__)
@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    form_data = request.form.items()
    for key, value in form_data:
        print(f"{key}: {value}")
    return "Form submitted successfully!"

if __name__ == '__main__':
    app.run()
```
Als je de applicatie uitvoert en naar [http://127.0.0.1:5000/](http://127.0.1:5000/) gaat, zie je het formulier. Wanneer je je naam invoert en op 'Submit' klikt, worden de gegevens naar de `/submit`-route gestuurd, waar ze worden verwerkt en afgedrukt in de terminal.
Probeer extra velden toe te voegen aan het formulier en kijk of ze correct verschijnen in de terminal wanneer je het formulier indient.

Soms wil je dat de route voor het formulier zelf ook de gegevens verwerkt. In dat geval kun je zowel `GET`- als `POST`-methoden voor dezelfde route gebruiken:
```python
from flask import Flask, render_template, request
app = Flask(__name__)
@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        form_data = request.form.items()
        for key, value in form_data:
            print(f"{key}: {value}")
        return "Form submitted successfully!"
    return render_template('form.html')

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld controleert de route of het verzoek een `POST`-verzoek is. Als dat zo is, worden de formuliergegevens verwerkt. Anders wordt het formulier weergegeven.
We moeten dan in het formulier de `action`-attribuut weghalen, zodat het formulier naar dezelfde route wordt verzonden:
```html
<!-- templates/form.html -->
<!doctype html>
<html>
  <head>
    <title>Flask Form</title>
  </head>
  <body>
    <h1>Submit Your Name</h1>
    <!--highlight-next-line-->
    <form method="POST" action="/">
      <input type="text" name="name" placeholder="Enter your name">
      <input type="submit" value="Submit">
    </form>
  </body>
</html>
```

### Validatie van formuliergegevens
Wanneer je formuliergegevens verwerkt, vertrouw je er vaak op dat gebruikers geldige gegevens invoeren. Het is echter wel belangrijk om deze gegevens te valideren want soms kan een gebruiker een foutieve invoer geven. Daarnaast kan een kwaadwillende gebruiker proberen om schadelijke gegevens in te voeren om je applicatie te compromitteren. Je kunt eenvoudige validatie uitvoeren door de gegevens te controleren voordat je ze verwerkt.

Hiervoor maken we gebruik van de `Flask-WTF` extensie, die formulieren en validatie in Flask vereenvoudigt. Eerst moet je de extensie installeren:
```bash
pip install Flask-WTF
```
Vervolgens kun je een formulier maken met validatie:
```python
from flask import Flask, render_template, request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)

class NameForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Submit')

@app.route('/', methods=['GET', 'POST'])
def form():
    form = NameForm()
    if form.validate_on_submit():
        name = form.name.data
        print(f"Name: {name}")
        return "Form submitted successfully!"
    return render_template('form.html', form=form)
if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we een `NameForm`-klasse gemaakt die een enkel tekstveld bevat met een `DataRequired`-validator. Dit zorgt ervoor dat het veld niet leeg mag zijn wanneer het formulier wordt ingediend.
Je moet ook de `form.html`-template aanpassen om het formulier weer te geven:
```html
<!-- templates/form.html -->
<!doctype html>
<html>
  <head>
    <title>Flask Form</title>
  </head>
  <body>
    <h1>Submit Your Name</h1>
    <form method="POST" action="/">
      {{ form.name.label }} {{ form.name(size=20) }}
      {{ form.submit() }}
    </form>
  </body>
</html>
```
In deze template kunnen we de velden van het formulier aan de hand van de `form`-variabele weergeven.
Wanneer je de applicatie uitvoert en naar [http://127.0.0.1:5000/](http://127.0.1:5000/) gaat, zie je het formulier. Als je probeert het formulier in te dienen zonder een naam in te voeren, zal de validatie falen en wordt het formulier opnieuw weergegeven zonder de gegevens te verwerken.

### CSRF-bescherming
CSRF (Cross-Site Request Forgery) is een veelvoorkomende beveiligingsdreiging voor webapplicaties. Hierbij wordt een gebruiker misleid om onbedoeld een actie uit te voeren op een website waarop hij is ingelogd. Denk bijvoorbeeld dat je bent ingelogd bij je bank en je opent een ander tabblad met een kwaadaardige website. Deze website kan dan proberen om een verzoek te sturen naar je bank om geld over te maken, zonder dat jij het doorhebt.

Dit kan gebeuren omdat je browser onthoudt dat je bent ingelogd. Wanneer je inlogt op een website, slaat je browser gegevens op (zoals cookies) om te bewijzen dat jij geauthenticeerd bent. Bij elk verzoek naar die website stuurt de browser deze gegevens automatisch mee. Daardoor denkt de bank dat het verzoek echt van jou komt, ook al heb je het niet zelf bewust uitgevoerd.

Om je Flask-applicatie te beschermen tegen CSRF-aanvallen, kun je gebruikmaken van de ingebouwde CSRF-bescherming van Flask-WTF. Deze extensie voegt automatisch een verborgen CSRF-token toe aan je formulieren en controleert dit token bij het indienen van het formulier.
In het vorige voorbeeld hebben we al de `Flask-WTF`-extensie gebruikt. We moeten ervoor zorgen dat we het CSRF-token in onze formulier-template opnemen:
```html
<!-- templates/form.html -->
<!doctype html>
<html>
  <head>
    <title>Flask Form</title>
  </head>
  <body>
    <h1>Submit Your Name</h1>
    <form method="POST" action="/">
      <!--highlight-next-line-->
      {{ form.hidden_tag() }}
      {{ form.name.label }} {{ form.name(size=20) }}
      {{ form.submit() }}
    </form>
  </body>
</html>
```
De regel `{{ form.hidden_tag() }}` voegt het CSRF-token toe aan het formulier. Wanneer het formulier wordt ingediend, controleert Flask-WTF automatisch of het token geldig is. Als het token ontbreekt of ongeldig is, wordt het verzoek geweigerd, waardoor je applicatie beschermd is tegen CSRF-aanvallen.

De token wordt gegenereerd op basis van een geheime sleutel die je moet instellen in je Flask-applicatie. Voeg de volgende regel toe aan je applicatieconfiguratie:
```python
app.config['SECRET_KEY'] = 'your_secret_key_here'
```
Vervang `'your_secret_key_here'` door een sterke, willekeurige tekenreeks om de veiligheid van je applicatie te waarborgen.


## 11. `Redirect()` en `url_for()`
In Flask kun je de functies `redirect()` en `url_for()` gebruiken om gebruikers naar andere routes binnen je applicatie te sturen. Dit is handig wanneer je bijvoorbeeld na het indienen van een formulier de gebruiker naar een andere pagina wilt leiden.
```python
from flask import Flask, redirect, url_for
app = Flask(__name__)

@app.route('/')
def home():
    return 'Welcome to the Home Page!'

@app.route('/go-to-home')
def go_to_home():
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we een route `/go-to-home` gemaakt die de gebruiker doorstuurt naar de `/`-route (de homepagina) met behulp van `redirect()` en `url_for()`. De `url_for('home')`-functie genereert de URL voor de `home`-functie.
Wanneer je de applicatie uitvoert en naar [http://127.0.0.1:5000/go-to-home](http://127.0.0.1:5000/go-to-home) gaat, word je automatisch doorgestuurd naar de homepagina.

:::info
Hoe weet de browser dat hij moet doorgestuurd worden?
Wanneer je de `redirect()`-functie gebruikt, stuurt Flask een HTTP-respons terug naar de browser met een statuscode van 302 (Found) en een `Location`-header die de nieuwe URL bevat. De browser interpreteert deze respons en maakt automatisch een nieuw verzoek naar de opgegeven URL in de `Location`-header. Hierdoor wordt de gebruiker doorgestuurd naar de gewenste pagina.
Je kan dit testen met cURL:
```bash
curl -I http://127.0.0.1:5000/go-to-home
```
Dit zal iets teruggeven zoals:
```
HTTP/1.1 302 FOUND
Server: Werkzeug/3.1.3 Python/3.12.3
Date: Mon, 15 Dec 2025 10:02:01 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 189
Location: /
Connection: close
```
:::

Je kan ook url_for() gebruiken om dynamische routes te genereren:
```python
from flask import Flask, redirect, url_for
app = Flask(__name__)
@app.route('/user/<username>')
def show_user_profile(username):
    return f'User: {username}'

@app.route('/go-to-user/<username>')
def go_to_user(username):
    return redirect(url_for('show_user_profile', username=username))

if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we een route `/go-to-user/<username>` gemaakt die de gebruiker doorstuurt naar de `/user/<username>`-route met de opgegeven gebruikersnaam.
Wanneer je de applicatie uitvoert en naar [http://127.0.0.1:5000/go-to-user/Alice](http://127.0.0.1:5000/go-to-user/Alice) gaat, word je automatisch doorgestuurd naar de pagina die de boodschap 'User: Alice' weergeeft. Vervang 'Alice' door een andere naam om verschillende gebruikers te testen.

## 12. Sessions
Flask biedt ondersteuning voor sessies, waarmee je gegevens kunt opslaan die specifiek zijn voor een gebruiker gedurende meerdere verzoeken. Dit is handig voor het bijhouden van gebruikersinformatie, zoals inlogstatus of voorkeuren.
```python
from flask import Flask, session, redirect, url_for, request, render_template
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key_here'

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        render_template('login.html')
        session['username'] = username
        return redirect(url_for('profile'))
    return render_template('login.html')


@app.route("/profile")
def profile():
    if 'username' in session:
        username = session['username']
        return f'Logged in as {username}'
    return 'You are not logged in'

if __name__ == '__main__':
    app.run()
```
```html
<!-- templates/login.html -->
<!doctype html>
<html>
  <head>
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
      <form method="post">
        <input type="text" name="username" placeholder="Enter username">
        <input type="submit" value="Login">
      </form>
  </body>
</html>
```

In dit voorbeeld hebben we een eenvoudige inlogroute `/login` die de gebruikersnaam opslaat in de sessie wanneer een gebruiker inlogt. De `/profile`-route controleert of de gebruiker is ingelogd door te kijken of de `username`-sleutel in de sessie bestaat.
Je kunt de applicatie uitvoeren en een `POST`-verzoek naar [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login) sturen met een formulier dat een `username`-veld bevat. Vervolgens kun je naar [http://127.0.0.1:5000/profile](http://127.0.0.1:5000/profile) gaan om te zien of je bent ingelogd.

:::info
**Hoe werken sessies in Flask?**

Wanneer een sessie wordt aangemaakt wordt de inhoud met base64 gecodeerd. Vervolgens wordt er een signatuur toegevoegd met behulp van de geheime sleutel die je hebt ingesteld in `app.config['SECRET_KEY']`. Deze handtekening zorgt ervoor dat de sessiegegevens niet kunnen worden gewijzigd door de client zonder dat dit wordt gedetecteerd door de server. Tot slot wordt er ook een timestamp toegevoegd om de geldigheid van de sessie te bepalen.
:::

## 13. Flash-berichten
Flask biedt een handige manier om tijdelijke berichten weer te geven aan gebruikers met behulp van flash-berichten. Deze berichten worden opgeslagen in de sessie en zijn beschikbaar voor het volgende verzoek.
```python
from flask import Flask, session, redirect, url_for, request, render_template, flash
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key_here'

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        render_template('login.html')
        session['username'] = username
        if not username:
            flash("Username cannot be empty!", "error")
            return redirect(url_for('login'))
        return redirect(url_for('profile'))
    return render_template('login.html')


@app.route("/profile")
def profile():
    if 'username' in session:
        username = session['username']
        return f'Logged in as {username}'
    return 'You are not logged in'

if __name__ == '__main__':
    app.run()
```
```html
<!-- templates/login.html -->
<!doctype html>
<html>
  <head>
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
      <form method="post">
        <input type="text" name="username" placeholder="Enter username">
        <input type="submit" value="Login">
      </form>
    <!--highlight-start-->
    {% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        <ul>
        {% for category, message in messages %}
            <li class="{{ category }}">{{ message }}</li>
        {% endfor %}
        </ul>
    {% endif %}
    {% endwith %}
    <!--highlight-end-->
  </body>
</html>
```
In dit voorbeeld hebben we een flash-bericht toegevoegd dat wordt weergegeven als de gebruiker probeert in te loggen zonder een gebruikersnaam in te voeren. Het bericht wordt weergegeven in de `login.html`-template met behulp van de `get_flashed_messages()`-functie.
Wanneer je de applicatie uitvoert en naar [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login) gaat, kun je proberen in te loggen zonder een gebruikersnaam in te voeren. Je zou dan het flash-bericht "Username cannot be empty!" moeten zien verschijnen.
:::info
**Categorieën voor flash-berichten**

Je kunt categorieën gebruiken om verschillende soorten flash-berichten te onderscheiden, zoals `success`, `error`, `warning` enzovoort. Dit maakt het gemakkelijker om de berichten in je templates te stylen op basis van hun categorie.
In het bovenstaande voorbeeld hebben we de categorie `error` gebruikt voor het flash-bericht. Je kunt deze categorie gebruiken in je CSS om het bericht op een specifieke manier te stylen.
:::

## 14. Middleware en filters
In Flask kun je middleware en filters gebruiken om verzoeken en antwoorden te verwerken voordat ze de route bereiken of nadat ze zijn verwerkt. Dit is handig voor taken zoals authenticatie, logging of het toevoegen van headers aan antwoorden.
```python
from flask import Flask, request

app = Flask(__name__)

@app.before_request
def before_request_func():
    print(f"Incoming request: {request.method} {request.path}")

@app.after_request
def after_request_func(response):
    print(f"Outgoing response: {response.status}")
    return response

@app.route('/')
def home():
  return 'Hello, World!'
if __name__ == '__main__':
    app.run()
```
In dit voorbeeld hebben we twee functies gedefinieerd: `before_request_func` en `after_request_func`. De `before_request_func` wordt uitgevoerd voordat elk verzoek de route bereikt, terwijl de `after_request_func` wordt uitgevoerd nadat de route is verwerkt en een antwoord is gegenereerd.
Wanneer je de applicatie uitvoert en naar [http://127.0.0.1:5000/](http://127.0.0.1:5000/) gaat, zie je in de terminal verschijnen:
```
Incoming request: GET /
Outgoing response: 200 OK
```
Je zou deze functies kunnen uitbreiden om meer geavanceerde taken uit te voeren, zoals het controleren van authenticatie of het toevoegen van aangepaste headers aan antwoorden.
## 15. Debugging
Flask heeft een ingebouwde debugger die je kunt inschakelen tijdens de ontwikkeling van je applicatie. Dit maakt het gemakkelijker om fouten op te sporen en te corrigeren.
Om de debugger in te schakelen, stel je de `DEBUG`-configuratie in op `True`:
```python
from flask import Flask

app = Flask(__name__)

app.debug = True

@app.route('/')
def home():
    return 'Hello, World!'
if __name__ == '__main__':
    app.run()
```
Wanneer je de applicatie uitvoert met de debugger ingeschakeld en een fout optreedt, zie je een gedetailleerde foutpagina in de browser met informatie over de fout en een interactieve traceback. Dit maakt het gemakkelijker om te begrijpen wat er mis is gegaan en waar de fout zich bevindt in je code. Daarnaast zal de debugger ook automatisch de server opnieuw starten telkens wanneer je wijzigingen aanbrengt in je code.

:::warning
Schakel de debugger nooit in op een productieomgeving, omdat dit beveiligingsrisico's met zich meebrengt. De debugger kan gevoelige informatie over je applicatie en server blootstellen aan kwaadwillende gebruikers.
:::

## 16. Flask Extensies
Flask heeft verschillende extensies die extra functionaliteit bieden, zoals database-integratie, authenticatie, formulieren en meer. Deze kan je eenvoudig toevoegen met pip.

