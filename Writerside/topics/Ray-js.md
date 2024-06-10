# Ray.js

Dit stukje code implementeert een JavaScript klasse genaamd `Ray`, die een straal representeert en tekent op een canvas.

De `Ray` klasse wordt gedefinieerd met een constructor (regels 5-16) die parameters zoals positie (`x`, `y`), hoek (`angle`), golflengte (`waveLength`), vulling (`fill`), en interne lichtkleur (`lightColorInternal`) accepteert. De constructor initialiseert de eigenschappen van de straal zoals positie, hoek, golflengte, vulling en interne lichtkleur. Indien deze waarden niet zijn opgegeven, worden standaardwaarden gebruikt. De hoek wordt genormaliseerd en de punten van de straal worden bijgewerkt.

De functie `draw(ctx)` (regels 22-79) tekent de straal op een gegeven tekencontext (`ctx`). Het berekent de straal delen (`rayParts`) door middel van de `calculateRay` methode en tekent zowel de lamp als de straaldelen. Indien de gebruiker aangeeft dat normaalvectoren moeten worden weergegeven (`user.showNormals`), worden deze ook getekend.

De functie `calculateRay(shapes)` (regels 81-179) berekent de delen van de straal (`rayParts`) door de hoek en de breking van de straal te bepalen bij interacties met objecten (`shapes`). Het houdt rekening met reflectie en breking aan de hand van Sellmeier's wet en controleert of de straal binnen een object is.

De functie `updatePoints()` (regels 181-185) berekent de punten van de straal op basis van de positie, breedte en hoogte van de straal, en roteert deze punten volgens de hoek. Het bepaalt ook het uitstootpunt van de straal (`emittingPoint`).

De functie `calculateRefractedAngle(n1, n2, angleIncidence)` (regels 187-211) berekent de gebroken hoek op basis van de brekingsindices (`n1` en `n2`) en de invalshoek (`angleIncidence`). Het houdt rekening met totale interne reflectie.

De functie `calculateCriticalAngle(n1, n2)` (regels 213-221) berekent de kritieke hoek voor totale interne reflectie op basis van de brekingsindices (`n1` en `n2`).

Deze code is te vinden op [Ray.js](https://github.com/MattterSteege/Prism-Simulation/blob/master/Ray.js)
![RayJsQR.svg](../../Images/RayJsQR.svg)