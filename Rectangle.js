
//Rectangle Class
Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;
function Rectangle(x, y, w, h, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#AAAAAA';
    this.points = [{x1: this.x, y1: this.y, x2: this.x + this.w, y2: this.y, x3: this.x + this.w, y3: this.y + this.h, x4: this.x, y4: this.y + this.h}];
}
// Draws this shape to a given context
Rectangle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

// Determine if a point is inside the shape's bounds
Rectangle.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
}

Rectangle.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(this.x,this.y,this.w,this.h)
}

Rectangle.prototype.intersectRay = function(ray) {
    const rectX = this.x;
    const rectY = this.y;
    const rectWidth = this.w;
    const rectHeight = this.h;

    // Calculate the slope of the ray
    const slope = Math.tan(ray.angleRadians);

    // Calculate the intersection points with the left and right edges of the rectangle
    const xLeft = rectX;
    const yLeft = ray.y + (xLeft - ray.x) * slope;

    const xRight = rectX + rectWidth;
    const yRight = ray.y + (xRight - ray.x) * slope;

    // Calculate the intersection points with the top and bottom edges of the rectangle
    const yTop = rectY;
    const xTop = ray.x + (yTop - ray.y) / slope;

    const yBottom = rectY + rectHeight;
    const xBottom = ray.x + (yBottom - ray.y) / slope;

    // Check if the intersection points are within the rectangle boundaries
    if (xLeft >= rectX && xLeft <= rectX + rectWidth && yLeft >= rectY && yLeft <= rectY + rectHeight) {
        return {
            x: xLeft,
            y: yLeft,
            shape: this,
            distance: Math.sqrt(Math.pow(xLeft - ray.x, 2) + Math.pow(yLeft - ray.y, 2)),
            normal: {x: -1, y: 0}
        };
    } else if (xRight >= rectX && xRight <= rectX + rectWidth && yRight >= rectY && yRight <= rectY + rectHeight) {
        return {
            x: xRight,
            y: yRight,
            shape: this,
            distance: Math.sqrt(Math.pow(xRight - ray.x, 2) + Math.pow(yRight - ray.y, 2)),
            normal: {x: 1, y: 0}
        };
    } else if (xTop >= rectX && xTop <= rectX + rectWidth && yTop >= rectY && yTop <= rectY + rectHeight) {
        return {
            x: xTop,
            y: yTop,
            shape: this,
            distance: Math.sqrt(Math.pow(xTop - ray.x, 2) + Math.pow(yTop - ray.y, 2)),
            normal: {x: 0, y: -1}
        };
    } else if (xBottom >= rectX && xBottom <= rectX + rectWidth && yBottom >= rectY && yBottom <= rectY + rectHeight) {
        return {
            x: xBottom,
            y: yBottom,
            shape: this,
            distance: Math.sqrt(Math.pow(xBottom - ray.x, 2) + Math.pow(yBottom - ray.y, 2)),
            normal: {x: 0, y: 1}
        };
    }

    return null;
}
