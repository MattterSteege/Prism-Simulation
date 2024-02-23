// Triangle Class
Triangle.prototype = new Shape();
Triangle.prototype.constructor = Triangle;

function Triangle(x, y, width, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1; //equilateral triangle
    this.fill = fill || '#AAAAAA';}

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
    const x3 = this.x + this.width / 2;
    const y3 = this.y;

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

Triangle.prototype.intersectRay = function(ray) {
    const angleRadians = ray.angleRadians;
    const rayX = ray.x;
    const rayY = ray.y;

    const height = (Math.sqrt(3) / 2) * this.width;
    const x1 = this.x;
    const y1 = this.y + height;
    const x2 = this.x + this.width;
    const y2 = this.y + height;
    const x3 = this.x + this.width / 2;
    const y3 = this.y;

    // s.ctx.beginPath();
    // s.ctx.moveTo(x1, y1);
    // s.ctx.lineTo(x2, y2);
    // s.ctx.lineTo(x3, y3);
    // s.ctx.closePath();
    // s.ctx.stroke();

    //check if the ray intersects x1y1 to x2y2
    const intersection1 = intersectLines(x1, y1, x2, y2, rayX, rayY, rayX + Math.cos(angleRadians), rayY + Math.sin(angleRadians));
    //check if the ray intersects x2y2 to x3y3
    const intersection2 = intersectLines(x2, y2, x3, y3, rayX, rayY, rayX + Math.cos(angleRadians), rayY + Math.sin(angleRadians));
    //check if the ray intersects x3y3 to x1y1
    const intersection3 = intersectLines(x3, y3, x1, y1, rayX, rayY, rayX + Math.cos(angleRadians), rayY + Math.sin(angleRadians));

    //if the ray intersects the line x1y1 to x2y2
    if(intersection1){
        return {
            x: intersection1.x,
            y: intersection1.y,
            shape: this,
            distance: Math.sqrt(Math.pow(intersection1.x - rayX, 2) + Math.pow(intersection1.y - rayY, 2)),
            normal: {x: 0, y: -1}
        };
    }
    //if the ray intersects the line x2y2 to x3y3
    else if(intersection2){
        return {
            x: intersection2.x,
            y: intersection2.y,
            shape: this,
            distance: Math.sqrt(Math.pow(intersection2.x - rayX, 2) + Math.pow(intersection2.y - rayY, 2)),
            normal: {x: 1, y: 0}
        };
    }
    //if the ray intersects the line x3y3 to x1y1
    else if(intersection3){
        return {
            x: intersection3.x,
            y: intersection3.y,
            shape: this,
            distance: Math.sqrt(Math.pow(intersection3.x - rayX, 2) + Math.pow(intersection3.y - rayY, 2)),
            normal: {x: -1, y: 0}
        };
    }
    return null;

    function intersectLines(x1, y1, x2, y2, x3, y3, x4, y4){
        const denominator = ((y4 - y3)*(x1 - x2) + (x3 - x4)*(y1 - y2));
        const a = ((y4 - y3)*(x1 - x3) + (x3 - x4)*(y1 - y3)) / denominator;
        const b = ((y1 - y2)*(x1 - x3) + (x2 - x1)*(y1 - y3)) / denominator;

        if(0 <= a && a <= 1 && 0 <= b && b <= 1){
            return {x: x1 + a*(x2 - x1), y: y1 + a*(y2 - y1)};
        }
        return null;
    }
};
