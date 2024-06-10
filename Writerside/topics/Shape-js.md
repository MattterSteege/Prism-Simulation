# Shape.js

Dit stukje code definieert een JavaScript object genaamd Shape, dat verschillende basis berekeningen bevat. Laten we eens kijken naar elk van de methoden:

De functie `intersectRay()` bepaalt het snijpunt tussen een straal en een vorm. Eerst berekent het de hoek van de straal en past het vervolgens iets aan om precisieproblemen te vermijden. Vervolgens doorloopt het elke rand van de vorm en controleert of de straal ermee snijdt. Als er een snijpunt wordt gevonden, slaat het het snijpunt en de normalen (loodrechte richtingen) op dat punt op. Na het vinden van alle snijpunten, identificeert het het dichtstbijzijnde snijpunt ten opzichte van het startpunt van de straal en stuurt informatie hierover, inclusief het snijpunt, de vorm en de normaal op dat punt.

De functie `contains()` controleert of een gegeven punt `(mx, my)` zich binnen een veelhoek bevindt die wordt gedefinieerd door een array (een lijst als het ware) van punten. Het maakt gebruik van het ray casting-algoritme, waarbij een straal wordt uitgezonden vanaf het gegeven punt en wordt geteld hoe vaak deze de randen van de veelhoek kruist. Als het aantal kruisingen oneven is, ligt het punt binnen de veelhoek; anders ligt het buiten.

Deze code wordt gebruikt als basis voor alle andere vormen, dus de `Circle.js`, `Line.js`, `Rectangle.js` & `Triangle.js` zijn allemaal opgebouwd met deze code als basis en krijgen de vorm door een aantal punt te definiëren, dit scheelt weer code en zorgt voor een soepeler gebruik tussen meerdere vormen

Deze code is te vinden op [Shape.js](https://github.com/MattterSteege/Prism-Simulation/blob/master/Shape.js)
![ShapeJsQR.svg](../../Images/RayJsQR.svg)