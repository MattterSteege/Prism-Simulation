//Ray class
Ray.prototype = new Shape();
Ray.prototype.constructor = Ray;
function Ray(x, y, angle, waveLength) {
    this.x = x || 0;
    this.y = y || 0;
    this.angleRadians = angle || 0; //angle in radians
    this.angleDegrees = angle * (180 / Math.PI); //angle in degrees
    this.waveLength = waveLength || 1;
    this.fill = '#000';

    this.RayParts = [{x: this.x, y: this.y}];
}


// Draws this line to a given context
Ray.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x - 50, this.y - 10, 50, 20);

    ctx.strokeStyle = RGBToHex(nmToRGB(this.waveLength));

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.RayParts.forEach(function (part) {
        ctx.lineTo(part.x, part.y);
    });
    ctx.closePath();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Ray.prototype.contains = function(mx, my) {
    //when clicked on the rectangle
    return (this.x - 50 <= mx) && (this.x + 50 >= mx) &&
        (this.y - 10 <= my) && (this.y + 10 >= my);
}

Ray.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.fillRect(this.x - 50, this.y - 10, 50, 20);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.RayParts.forEach(function (part) {
        ctx.lineTo(part.x, part.y);
    });
    ctx.closePath();
    ctx.stroke();
}

Ray.prototype.calculateRay = function(shapes){
    var ray = this;
    var rayParts = [];
    var maxDistance = 1000;
    var closestIntersection = null;
    var closestShape = null;
    var closestDistance = maxDistance;

    shapes.forEach(function(shape){
        var intersection = shape.intersectRay(ray);
        if(intersection){
            var distance = Math.sqrt(Math.pow(ray.x - intersection.x, 2) + Math.pow(ray.y - intersection.y, 2));
            if(distance < closestDistance){
                closestDistance = distance;
                closestIntersection = intersection;
                closestShape = shape;
            }
        }
    });

    if(closestIntersection){
        rayParts.push(closestIntersection);
    }else{
        rayParts.push({x: ray.x + Math.cos(ray.angleRadians) * maxDistance, y: ray.y + Math.sin(ray.angleRadians) * maxDistance});
    }

    ray.RayParts = rayParts;
}