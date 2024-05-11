# Rectangle.js

Dit stukje code definieert een JavaScript klasse genaamd `Rectangle`, die een rechthoekige vorm vertegenwoordigt. Laten we elk onderdeel bekijken:

1. **Constructor (`Rectangle`):** De constructor wordt gebruikt om een nieuw rechthoekobject te maken. Het accepteert parameters zoals de positie van de linkerbovenhoek (`x`, `y`), de breedte (`w`) en de hoogte (`h`) van de rechthoek, de rotatiehoek (`angle`) en de vulkleur (`fill`). Als een parameter niet wordt opgegeven, worden standaardwaarden gebruikt. Vervolgens wordt de methode `updatePoints()` aangeroepen om de hoekpunten van de rechthoek te berekenen en bij te werken.

2. **Draw methode (`draw`):** Deze methode tekent de rechthoek op een canvascontext (`ctx`). Eerst wordt de vulling en de lijnkleur ingesteld op de opgegeven vulkleur. Vervolgens wordt een nieuw pad gestart en worden de hoekpunten van de rechthoek doorlopen om een gesloten vorm te creëren. Tot slot wordt het pad gesloten en de omtrek van de rechthoek getekend.

3. **Contains methode (`contains`):** Deze methode controleert of een gegeven punt (`mx`, `my`) zich binnen de grenzen van de rechthoek bevindt. Het controleert of de x- en y-coördinaten van het punt binnen de x- en y-bereiken van de rechthoek liggen.

4. **UpdatePoints methode (`updatePoints`):** Deze methode berekent en werkt de hoekpunten van de rechthoek bij op basis van de huidige positie, breedte, hoogte en rotatiehoek van de rechthoek. Het gebruikt de huidige eigenschappen van de rechthoek om de hoekpunten te genereren en roteert ze vervolgens indien nodig.

In essentie biedt deze klasse functionaliteit om rechthoekige vormen te maken, te tekenen, te controleren op puntinclusie en de hoekpunten bij te werken op basis van de huidige eigenschappen van de rechthoek.