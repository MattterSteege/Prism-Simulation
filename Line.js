//Line Class
Line.prototype = new Shape();
Line.prototype.constructor = Line;

function Line(x1, y1, angle, length, w, fill) {
    this.x = x1 || 0;
    this.y = y1 || 0;
    this.angleDegrees = angle || 0;
    this.angleRadians = Math.PI * this.angleDegrees / 180;
    this.length = length || 1;
    this.w = w || 1;
    this.fill = fill || '#AAAAAA';
    //make 2D (4 points) for the rectangle
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.length, y: this.y}, {x: this.x + this.length, y: this.y + this.w}, {x: this.x, y: this.y + this.w}];
    this.points = rotatePoints(this.points, this.angleRadians);
}
// Draws this shape to a given context
Line.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.fill();
}

// Determine if a point is inside the shape's bounds
Line.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return (this.x <= mx) && (this.x + this.length >= mx) &&
        (this.y <= my) && (this.y + this.w >= my);
}

Line.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    this.draw(ctx);
    ctx.stroke();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.length, y: this.y}, {x: this.x + this.length, y: this.y + this.w}, {x: this.x, y: this.y + this.w}];
    this.points = rotatePoints(this.points, this.angleRadians);
}