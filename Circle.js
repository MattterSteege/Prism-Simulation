//Class Circle
Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
function Circle(x, y, w, fill) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else! We could put "Lalala" for the value of x
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.fill = fill || '#AAAAAA';
}
// Draws this shape to a given context
Circle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    //ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// Determine if a point is inside the shape's bounds
Circle.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return  (this.x - this.w <= mx) && (this.x + this.w >= mx) &&
        (this.y - this.w <= my) && (this.y + this.w >= my);
}

Circle.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    //ctx.strokeRect(this.x,this.y,this.w,this.h)
    this.draw(ctx);
    ctx.stroke();
}

Circle.prototype.scale = function (factor) {
    this.w = this.w * factor;
}
