# Triangle.js

Dit stukje code definieert een `Triangle`-klasse die een driehoek vertegenwoordigt en ervan erft van de `Shape`-klasse. Laten we eens kijken naar wat dit codefragment doet:

De `Triangle`-functie is de constructor van de `Triangle`-klasse. Deze functie initialiseert een nieuwe driehoek met de opgegeven x- en y-coördinaten, breedte, hoek (in graden) en vulkleur. Als er geen waarden worden opgegeven, worden standaardwaarden gebruikt. De hoek wordt genormaliseerd om ervoor te zorgen dat deze binnen het bereik van 0 tot 360 graden blijft.

De `draw`-methode tekent de driehoek op een gegeven context (`ctx`). Het stelt eerst de vulkleur en lijnkleur van de context in. Vervolgens begint het een nieuw pad en verplaatst het naar het eerste punt van de driehoek. Daarna doorloopt het alle punten van de driehoek en tekent het lijnen tussen deze punten. Na het sluiten van het pad wordt de omtrek van de driehoek getekend door de `stroke`-methode van de context op te roepen.

De `updatePoints`-methode berekent de hoekpunten van de driehoek op basis van de huidige positie, breedte en hoek van de driehoek. Het berekent de hoogte van de driehoek op basis van de breedte (aangenomen wordt dat het een gelijkzijdige driehoek is) en gebruikt vervolgens trigonometrie om de coördinaten van de drie hoekpunten te berekenen. Daarna worden de punten geroteerd op basis van de opgegeven hoek, en worden ze opgeslagen in het `points`-attribuut van de driehoek.

Kortom, dit stukje code implementeert een `Triangle`-klasse die een driehoek representeert, deze kan tekenen op een canvas en de hoekpunten kan updaten op basis van de positie, breedte en hoek van de driehoek.