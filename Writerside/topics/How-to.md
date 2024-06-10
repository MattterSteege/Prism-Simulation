# Hoe gebruik je de simulatie

Om de simulatie beter te kunnen begrijpen kan je er het best natuurlijk zelf mee gaan spelen, dat doe je zo:

## De simulatie downloaden
Je kan de simulatie heel makkelijk gebruiken, je doet dat zo:

<procedure title="Download de simulatie" id="download-sim">
    <step>
        <p>je gaat naar <a href="https://github.com/MattterSteege/Prism-Simulation/">Mijn github pagina voor de Prismasimulatie</a></p>
    </step>
    <step>
        <p>Klik <shortcut>Code</shortcut> en dan op <shortcut>Download ZIP</shortcut></p>
         <img src="image_1.png">
    </step>
    <step>
        <p>Pak het ZIP-bestand uit door met de <shortcut>rechtmuisknop</shortcut> op het bestand te klikken, dan op <shortcut>Alles uitpakken...</shortcut> te klikken en als op <shortcut>Uitpakken</shortcut> te klikken</p>
         <img src="image_2.png">
    </step>
    <step>
        <p><shortcut>Dubbelklik</shortcut> op index.html en de simulatie opent automatisch in je geselecteede browser</p>
         <img src="image_3.png">
    </step>
</procedure>

## De simulatie gebruiken

De simulatie is heel makkelijk te gebruiken en dat gaat zo:
- `linkermuisknop indrukken op een vorm en slepen`: sleept die vorm over het canvas
- `scrollen met je muis op een vorm`: draait de vorm

## De simulatie aanpassen (vooraf)
Je kan de simulatie ook aanpassen naar jouw eigen smaak je gaat hiervoor naar `config.js` in de bestanden die je in de vorige stap het gedownload dan kan je vervolgens de volgende dingen aanpassen:

showNormals
: `true`: laat de normaal-lijnen van de simulatie zien. `false`: laat deze lijnen niet zien

AmountOfRays
: Dit is een geheel getal dat aangeeft hoeveel lichtlijnen er getekend moeten worden, hoe meer lijnen hoe dichter bij de werkelijkheid, maar dit kost meer vermogen van je PC/Laptop

maxLightBounces
: Dit is een geheel getal dat aangeeft wat de maximale hoeveelheid aan lichtbreking berekeningen er gedaan mogen worden. Dit is een maximum, de simulatie stop waneer de lichtstraal uit beeld gaat sowieso!

*mogelijke andere opties in `config.js` zijn niet gebruikt in de code!

## De simulatie aanpassen (real-time)
Je kan de simulatie ook aanpassen tewijl hij bezig is, dit doe je door `user.[showNormals | AmountOfRays | maxLightBounces] = [waarde]` in te typen in de Chrome console. Deze open je door `Ctrl + Shift + I` op je toetsenbord in te toetsen.

Ook kan je nieuwe vormen toevoegen via de Chrome console dat gaat als volgt:

<tabs>
    <tab title="Driehoek">
        <code-block lang="javascript">s.addShape(new Triangle(x, y, width, color));</code-block>
        Hierin is:
        <ul>
            <li>`x` een x-coordinaat</li>
            <li>`y` een y-coordinaat</li>
            <li>`width` een breedte</li>
            <li>`color` een HEX kleur (zoals #ffffff voor wit)</li>
        </ul>
    </tab>
    <tab title="Rechthoek">
        <code-block lang="javascript">s.addShape(new Rectangle(x, y, width, heigth, color));</code-block>
        <ul>
            <li>`x` een x-coordinaat</li>
            <li>`y` een y-coordinaat</li>
            <li>`width` een breedte</li>
            <li>`height` een hoogte</li>
            <li>`color` een HEX kleur (zoals #ffffff voor wit)</li>
        </ul>
    </tab> 
    <tab title="Lijn">
        <code-block lang="javascript">s.addShape(new Line(x, y, angle, length, width, color));</code-block>
        <ul>
            <li>`x` een x-coordinaat</li>
            <li>`y` een y-coordinaat</li>
            <li>`angle` de hoek in graden</li>
            <li>`length` de lengte</li>
            <li>`width` een breedte</li>
            <li>`color` een HEX kleur (zoals #ffffff voor wit)</li>
        </ul>
    </tab> 
    <tab title="Cirkel">
        <code-block lang="javascript">s.addShape(new Circle(x, y, radius, color));</code-block>
        <ul>
            <li>`x` een x-coordinaat</li>
            <li>`y` een y-coordinaat</li>
            <li>`radius` de radius van de cirkel</li>
            <li>`color` een HEX kleur (zoals #ffffff voor wit)</li>
        </ul>
    </tab>
</tabs>

