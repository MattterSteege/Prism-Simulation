// Triangle Class
Triangle.prototype = new Shape();
Triangle.prototype.constructor = Triangle;

function Triangle(x, y, width, height, hasEqualEdges, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1;
    this.hasEqualEdges = hasEqualEdges || false;
    this.fill = fill || '#AAAAAA';
    this.points = [{x: this.x, y: this.y + this.height}, {x: this.x + this.width, y: this.y + this.height}, {x: this.x + this.width / 2, y: this.y}];
}

// Draws this shape to a given context
Triangle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    // Equilateral triangle
    const height = (Math.sqrt(3) / 2) * this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + height);
    ctx.lineTo(this.x + this.width, this.y + height);
    ctx.lineTo(this.x + this.width / 2, this.y);
    ctx.closePath();
    ctx.fill();
};

// Determine if a point is inside the shape's bounds
Triangle.prototype.contains = function(mx, my) {
    const height = (Math.sqrt(3) / 2) * this.width;
    const x1 = this.x;
    const y1 = this.y + height;
    const x2 = this.x + this.width;
    const y2 = this.y + height;
    const x3 = this.hasEqualEdges ? this.x + this.width / 2 : this.x;
    const y3 = this.hasEqualEdges ? this.y : this.y + this.height;

    const denominator = ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
    const a = ((y2 - y3)*(mx - x3) + (x3 - x2)*(my - y3)) / denominator;
    const b = ((y3 - y1)*(mx - x3) + (x1 - x3)*(my - y3)) / denominator;
    const c = 1 - a - b;

    return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
};

Triangle.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    const height = (Math.sqrt(3) / 2) * this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + height);
    ctx.lineTo(this.x + this.width, this.y + height);
    ctx.lineTo(this.x + this.width / 2, this.y);
    ctx.closePath();
    ctx.stroke();
};

Triangle.prototype.scale = function (factor) {
    this.width = this.width * factor;
    this.height = this.height * factor;
};
