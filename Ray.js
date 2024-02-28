//Ray class
Ray.prototype = new Shape();
Ray.prototype.constructor = Ray;
function Ray(x, y, angle, waveLength, fill) {
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
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
    this.RayParts = [{x: (this.points[1].x + this.points[2].x) / 2, y: (this.points[1].y + this.points[2].y) / 2}];
}


// Draws this line to a given context
Ray.prototype.draw = function(ctx) {
    this.updatePoints();
    this.calculateRay(s.shapes);


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


    //draw the ray
    ctx.strokeStyle = RGBToHex(nmToRGB(this.waveLength));

    //console.log(this.RayParts);

    ctx.beginPath();
    ctx.moveTo(this.emittingPoint.x, this.emittingPoint.y);
    ctx.lineTo(this.RayParts[0].x, this.RayParts[0].y);
    ctx.stroke();
    ctx.closePath();

    //draw the normal
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    if (this.RayParts[0].normal && user.showNormals) {
        ctx.moveTo(this.RayParts[0].normal.x1, this.RayParts[0].normal.y1);
        ctx.lineTo(this.RayParts[0].normal.x2, this.RayParts[0].normal.y2);
    }
    ctx.stroke();
    ctx.closePath();
}

// Determine if a point is inside the shape's bounds
// Ray.prototype.contains = function(mx, my) {
//     //when clicked on the rectangle
//     return (this.x - 50 <= mx) && (this.x + 50 >= mx) &&
//         (this.y - 10 <= my) && (this.y + 10 >= my);
// }

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
    const rot = this.points = rotatePoints(this.points, this.angleRadians);
    this.emittingPoint = {x: (rot[1].x + rot[2].x) / 2, y: (rot[1].y + rot[2].y) / 2};
}