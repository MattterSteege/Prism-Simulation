//Line Class
Line.prototype = new Shape();
Line.prototype.constructor = Line;
function Line(x1, y1, x2, y2, w, fill) {
    this.x = x1 || 0;
    this.y = y1 || 0;
    this.x2 = x2 || 0;
    this.y2 = y2 || 0;
    this.w = w || 1;
    this.fill = fill || '#00ff00';
    this.points = [{x: this.x, y: this.y}, {x: this.x2, y: this.y2}];
}
// Draws this shape to a given context
Line.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.fill;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.closePath();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Line.prototype.contains = function(mx, my) {
    //if the point is within 5 pixels of the line, return true
    return (this.x - 5 <= mx) && (this.x2 + 5 >= mx) &&
        (this.y - 5 <= my) && (this.y2 + 5 >= my);
}

Line.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.closePath();
    ctx.stroke();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x2, y: this.y2}];
}