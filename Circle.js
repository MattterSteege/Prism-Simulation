const CircleResolutions = 100;

//Class Circle
Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
function Circle(x, y, w, fill) {

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.fill = fill || '#AAAAAA';
    this.points = [];

    this.updatePoints();
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

Circle.prototype.updatePoints = function(){
    this.points = [];
    for (var i = 0; i < CircleResolutions; i++){
        var angle = (i / CircleResolutions) * Math.PI * 2;
        this.points.push({x: this.x + this.w * Math.cos(angle), y: this.y + this.w * Math.sin(angle)});
    }
}