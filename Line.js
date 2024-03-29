//Line Class
Line.prototype = new Shape();
Line.prototype.constructor = Line;

function Line(x1, y1, length, w, angle, fill) {
    this.x = x1 || 0;
    this.y = y1 || 0;
    this.length = length || 1;
    this.w = w || 1;
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
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
    //ctx.fill();
    ctx.stroke();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.length}, {x: this.x, y: this.y + this.length}];
    this.points = rotatePoints(this.points, this.angleDegrees);
}

