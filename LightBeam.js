//Lightbeam class
Lightbeam.prototype = new Shape();
Lightbeam.prototype.constructor = Lightbeam;
function Lightbeam(x, y, angle, waveLength) {
    this.x = x || 0;
    this.y = y || 0;
    this.angleRadians = angle || 0; //angle in radians
    this.angleDegrees = angle * (180 / Math.PI); //angle in degrees
    this.waveLength = waveLength || 1;
    this.fill = '#000';

    this.lightbeamParts = [{x: this.x + 100, y: this.y + 0}];
}

//s.shapes[1].lightbeamParts.push({x: 100, y: 100});

// Draws this line to a given context
Lightbeam.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x - 50, this.y - 10, 50, 20);

    ctx.strokeStyle = RGBToHex(nmToRGB(this.waveLength));

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.lightbeamParts.forEach(function (part) {
        ctx.lineTo(part.x, part.y);
    });
    ctx.closePath();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Lightbeam.prototype.contains = function(mx, my) {
    //when clicked on the rectangle
    return (this.x - 50 <= mx) && (this.x + 50 >= mx) &&
        (this.y - 10 <= my) && (this.y + 10 >= my);
}

Lightbeam.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.fillRect(this.x - 50, this.y - 10, 50, 20);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.lightbeamParts.forEach(function (part) {
        ctx.lineTo(part.x, part.y);
    });
    ctx.closePath();
    ctx.stroke();
}