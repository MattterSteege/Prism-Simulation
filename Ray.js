//Ray class
Ray.prototype = new Shape();
Ray.prototype.constructor = Ray;
function Ray(x, y, angle, waveLength) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = 50;
    this.h = 20;
    // this.angleDegrees = angle || 0;
    // this.angleRadians = Math.PI * this.angleDegrees / 180;
    //every time this.angleDegrees is set, this.angleRadians should be updated
    Object.defineProperty(this, 'angleDegrees', {
        get: function() {
            return this._angleDegrees;
        },
        set: function(value) {
            this._angleDegrees = value;
            this.angleRadians = Math.PI * value / 180;
        }
    });
    this.angleDegrees = angle || 0;
    this.waveLength = waveLength || 1;
    this.fill = '#000';
    this.points = [{x: this.x - this.w / 2, y: this.y - this.h / 2}, {x: this.x + this.w / 2, y: this.y - this.h / 2}, {x: this.x + this.w / 2, y: this.y + this.h / 2}, {x: this.x - this.w / 2, y: this.y + this.h / 2}];
    this.RayParts = [{x: (this.points[1].x + this.points[2].x) / 2, y: (this.points[1].y + this.points[2].y) / 2}];
    this.emittingPoint = {x: (this.points[1].x + this.points[2].x) / 2, y: (this.points[1].y + this.points[2].y) / 2};
}


// Draws this line to a given context
Ray.prototype.draw = function(ctx) {
    const rotatedPoints = rotatePoints(this.points, this.angleRadians);
    this.emittingPoint = {x: (rotatedPoints[1].x + rotatedPoints[2].x) / 2, y: (rotatedPoints[1].y + rotatedPoints[2].y) / 2};

    ctx.fillStyle = this.fill;
    ctx.moveTo(rotatedPoints[0].x, rotatedPoints[0].y);
    rotatedPoints.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(rotatedPoints[0].x, rotatedPoints[0].y);
    ctx.fill();

    ctx.strokeStyle = RGBToHex(nmToRGB(this.waveLength));

    ctx.beginPath();
    ctx.moveTo(this.emittingPoint.x, this.emittingPoint.y);
    ctx.lineTo(this.RayParts[0].x, this.RayParts[0].y);

    ctx.stroke();
    ctx.closePath();
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
    this.draw(ctx);
}

Ray.prototype.calculateRay = function(shapes){
    var ray = this;
    var rayParts = [];
    var maxDistance = 10000;
    var closestIntersection = null;
    var closestShape = null;
    var closestDistance = maxDistance;

    shapes.forEach(function(shape){
        var intersection = shape.intersectRay(ray, shape);
        if(intersection){
            intersection.forEach(function(intersect){
                var distance = Math.sqrt(Math.pow(intersect.x - ray.x, 2) + Math.pow(intersect.y - ray.y, 2));
                if(distance < closestDistance){
                    closestDistance = distance;
                    closestIntersection = intersect;
                    closestShape = shape;
                }
            });
        }
    });

    if(closestIntersection){
        rayParts.push(closestIntersection);
    }else{
        rayParts.push({x: ray.x + Math.cos(ray.angleRadians) * maxDistance, y: ray.y + Math.sin(ray.angleRadians) * maxDistance});
    }

    ray.RayParts = rayParts;
}

Ray.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.h}, {x: this.x, y: this.y + this.h}];
    this.emittingPoint = {x: (this.points[1].x + this.points[2].x) / 2, y: (this.points[1].y + this.points[2].y) / 2};
}