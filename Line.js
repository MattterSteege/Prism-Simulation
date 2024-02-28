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

    this.updatePoints();
}
// Draws this shape to a given context
Line.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    ctx.fill();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.length, y: this.y}, {x: this.x + this.length, y: this.y + this.w}, {x: this.x, y: this.y + this.w}];
    this.points = rotatePoints(this.points, this.angleRadians);
}