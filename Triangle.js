// Triangle Class
Triangle.prototype = new Shape();
Triangle.prototype.constructor = Triangle;

function Triangle(x, y, width, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1; //equilateral triangle
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

// // Determine if a point is inside the shape's bounds
// Triangle.prototype.contains = function(mx, my) {
//     const height = (Math.sqrt(3) / 2) * this.width;
//     const x1 = this.x;
//     const y1 = this.y + height;
//     const x2 = this.x + this.width;
//     const y2 = this.y + height;
//     const x3 = this.x + this.width / 2;
//     const y3 = this.y;
//
//     const denominator = ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
//     const a = ((y2 - y3)*(mx - x3) + (x3 - x2)*(my - y3)) / denominator;
//     const b = ((y3 - y1)*(mx - x3) + (x1 - x3)*(my - y3)) / denominator;
//     const c = 1 - a - b;
//
//     return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
// };

Triangle.prototype.updatePoints = function(){
    const height = (Math.sqrt(3) / 2) * this.width;
    this.points = [{x: this.x, y: this.y + height}, {x: this.x + this.width, y: this.y + height}, {x: this.x + this.width / 2, y: this.y}];
}