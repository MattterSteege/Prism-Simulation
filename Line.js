//Line Class
Line.prototype = new Shape();
Line.prototype.constructor = Line;

function Line(x1, y1, rotation, length, w, fill) {
    this.x = x1 || 0;
    this.y = y1 || 0;
    this.rotation = Math.PI * rotation / 180 || 0; //degree to radian
    this.length = length || 1;
    this.w = w || 1;
    this.fill = fill || '#00ff00';
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.length * Math.cos(this.rotation), y: this.y + this.length * Math.sin(this.rotation)}];
}
// Draws this shape to a given context
Line.prototype.draw = function(ctx) {
    const lineW = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = this.w;
    ctx.strokeStyle = this.fill;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = lineW;
}

// Determine if a point is inside the shape's bounds
Line.prototype.contains = function(mx, my) {
    const grabDistance = 5;

    //if the point is within 5 pixels of the line, return true
    return (this.points[0].x - grabDistance <= mx) && (this.points[1].x + grabDistance >= mx) &&
        (this.points[0].y - grabDistance <= my) && (this.points[1].y + grabDistance >= my);
}

Line.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.closePath();
    ctx.stroke();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.length * Math.cos(this.rotation), y: this.y + this.length * Math.sin(this.rotation)}];
    console.log(this.points);
}