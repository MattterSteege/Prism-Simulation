# LightDispersion.js

De brekingsindex van een materiaal is een fundamentele eigenschap die beschrijft hoe licht zich door dat medium voortplant. Het is de verhouding van de lichtsnelheid in een vacuüm tot de lichtsnelheid in het materiaal. Hoe hoger de brekingsindex, hoe langzamer het licht door het medium reist en hoe meer het buigt of breekt wanneer het van het ene naar het andere medium gaat.

Nu is de brekingsindex van een materiaal geen constante waarde; het hangt af van de golflengte van het licht. Dit fenomeen staat bekend als dispersie, en het verklaart waarom een prisma wit licht kan opsplitsen in zijn samenstellende kleuren (een regenboog). Verschillende golflengten van licht hebben verschillende brekingsindices in hetzelfde materiaal, waardoor ze onder verschillende hoeken buigen.

Om het gedrag van licht in verschillende materialen nauwkeurig te modelleren, heb je een manier nodig om de brekingsindex voor elke gegeven golflengte te berekenen. Hier komt de Sellmeier-vergelijking om de hoek kijken.

De Sellmeier-vergelijking berekend de brekingsindex van een transparant materiaal (zoals glas) relateert aan de golflengte van licht. Het werd ontwikkeld door experimentele gegevens aan een wiskundig model aan te passen. De functie `getSellmeierValue(wavelength)`. in de gegeven code implementeert deze vergelijking, met behulp van vooraf bepaalde constanten (B1, B2, B3, C1, C2 en C3) die specifiek zijn voor het gemodelleerde materiaal.

De vergelijking gaat als volgt:

<code-block lang="tex">
n^2\left(\lambda\right)=1+\frac{B_1\lambda^2}{\lambda^2-C_1}+\frac{B_2\lambda^2}{\lambda^2-C_2}+\frac{B_3\lambda^2}{\lambda^2-C_3}
</code-block>

daarbij is:<br>
- n de brekingsindex
- λ de golflengte van het licht in vacuüm in meters
- B1, B2, B3, C1, C2 en C3 de experimenteel bepaalde Sellmeier-coëfficiënten

Maar de Sellmeier-vergelijking alleen is niet genoeg om het gedrag van licht in verschillende media volledig te beschrijven. Je moet ook rekening houden met de brekingsindex van lucht, die licht varieert met de golflengte. De functie `getAirIndex(Wavelength)`. berekent de brekingsindex van lucht met behulp van een empirische formule die de golflengte als input neemt.


```Javascript
//LightDispersion.js
function getSellmeierValue(wavelength) {
    wavelength = wavelength * 1E-9; // Convert nm to m
    const L2 = wavelength * wavelength
    const B1 = 1.03961212;
    const B2 = 0.231792344;
    const B3 = 1.01046945;

    // Constants for converting to metric
    const C1 = 6.00069867E-3 * 1E-12; //
    const C2 = 2.00179144E-2 * 1E-12;
    const C3 = 1.03560653E2 * 1E-12;

    // Calculate the Sellmeier value using Sellmeier equation
    return Math.sqrt( 1 + B1 * L2 / ( L2 - C1 ) + B2 * L2 / ( L2 - C2 ) + B3 * L2 / ( L2 - C3 ) );
}

function getAirIndex(wavelength) {
    return 1 +
        5792105E-8 / ( 238.0185 - Math.pow( wavelength * 1E6, -2 ) ) +
        167917E-8 / ( 57.362 - Math.pow( wavelength * 1E6, -2 ) );
}
```