// Triangle Class
Triangle.prototype = new Shape();
Triangle.prototype.constructor = Triangle;

function Triangle(x, y, width, angle, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1; //equilateral triangle
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
    this.fill = fill || '#AAAAAA';

    this.updatePoints();}

// Draws this shape to a given context
Triangle.prototype.draw = function(ctx) {
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
};

Triangle.prototype.updatePoints = function(){
    const height = (Math.sqrt(3) / 2) * this.width;
    this.points = [{x: this.x, y: this.y + height}, {x: this.x + this.width, y: this.y + height}, {x: this.x + this.width / 2, y: this.y}];
    this.points = rotatePoints(this.points, this.angleDegrees);
}