const CircleResolutions = 1000;

//Class Circle
Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
function Circle(x, y, w, fill) {

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
}
// Draws this shape to a given context
Circle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Circle.prototype.contains = function(mx, my) {
    //check if the point is inside the circle
    return (Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2) <= Math.pow(this.w, 2));
}

Circle.prototype.updatePoints = function(){
    this.points = [];
    for (var i = 0; i < CircleResolutions; i++){
        var angle = (i / CircleResolutions) * Math.PI * 2;
        this.points.push({x: this.x + this.w * Math.cos(angle), y: this.y + this.w * Math.sin(angle)});
    }
}