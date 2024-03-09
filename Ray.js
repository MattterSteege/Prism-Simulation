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
    this.waveLength = waveLength || 500;
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
    this.RayParts = [];

    this.isInsideObject = false;
}

let check = 0;

// Draws this line to a given context
Ray.prototype.draw = async function (ctx) {
    check = Math.random();
    this.updatePoints();
    this.RayParts = [];

    //draw the lamp
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

    s.shapes.forEach((shape) => {
        if (shape.contains(this.emittingPoint.x, this.emittingPoint.y)) {
            this.isInsideObject = true;
        }
    });

    const CurrentCheck = check;
    user.showDebug ? console.clear() : null;
    for (let i = 0; i < user.maxLightBounces - 1; i++) {
        if (CurrentCheck !== check) return;
        this.calculateRay(s.shapes);
        ctx.strokeStyle = RGBToHex(nmToRGB(this.waveLength));

        let rayPart = this.RayParts[i];
        if (!rayPart) return;

        ctx.beginPath();
        ctx.strokeStyle = '#f00';
        ctx.moveTo(rayPart.xStart, rayPart.yStart);
        ctx.lineTo(rayPart.xEnd, rayPart.yEnd);
        ctx.stroke();
        ctx.closePath();

        if (!rayPart.normals) return;

        let angleOfNormal = Math.atan2(rayPart.normals[0].y2 - rayPart.normals[0].y1, rayPart.normals[0].x2 - rayPart.normals[0].x1);
        let angleOfRay = Math.atan2(rayPart.yEnd - rayPart.yStart, rayPart.xEnd - rayPart.xStart);
        if (angleOfNormal < 0) angleOfNormal += 2 * Math.PI;
        if (angleOfRay < 0) angleOfRay += 2 * Math.PI;

        //create the smallest possible arc between the two angles
        let startAngle = angleOfRay + Math.PI;
        let endAngle = angleOfNormal;
        let difference = endAngle - startAngle;
        let counterClockwise = false;
        if (startAngle > endAngle) {
            counterClockwise = true;

            if (startAngle - endAngle > Math.PI) {
                let temp = startAngle;
                startAngle = endAngle;
                endAngle = temp;
                difference = endAngle - startAngle;

                if (endAngle - (Math.PI * 2) > startAngle) {
                    let temp = startAngle;
                    startAngle = endAngle - (Math.PI * 2);
                    endAngle = temp;
                    difference = endAngle - startAngle;
                }
            }
        }

        difference = Math.abs(difference);

        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        if (user.showNormals) {
            ctx.moveTo(rayPart.normals[0].x1, rayPart.normals[0].y1);
            ctx.lineTo(rayPart.normals[0].x2, rayPart.normals[0].y2);
            ctx.moveTo(rayPart.xEnd, rayPart.yEnd);
            ctx.arc(rayPart.xEnd, rayPart.yEnd, 20, startAngle, endAngle, counterClockwise);
        }
        ctx.stroke();
        ctx.closePath();



        const refraction = this.calculateRefractedAngle(getAirIndex(this.waveLength), getSellmeierValue(this.waveLength), RadiansToDegrees(difference));

        this.RayParts[i].nextAngle = normalizeDegreeAngle(RadiansToDegrees(angleOfNormal) - 180 + refraction.angleToAdd);

        if (user.doStagedDraw > 0)
            await delay(user.doStagedDraw)

        this.isInsideObject = !this.isInsideObject;
    }
}

Ray.prototype.calculateRay = function(shapes){
    //make a reference by value
    var ray = this;
    ray = Object.assign({}, ray); //clone the object
    var rayParts = ray.RayParts;
    var maxDistance = 10000;
    var closestIntersection = null;
    var closestShape = null;
    var closestDistance = maxDistance;

    ray.angleRadians = this.RayParts.length > 0 ? DegreesToRadians(this.RayParts[this.RayParts.length - 1].nextAngle) : ray.angleRadians;

    shapes.forEach(function(shape){
        if (shape.constructor.name === "Ray" || shape.constructor.name === "Text") return;
        var intersection = shape.intersectRay(ray, shape);
        if(intersection){
            intersection.forEach(function(intersect){
                var distance = Math.sqrt(Math.pow(intersect.xEnd - ray.emittingPoint.x, 2) + Math.pow(intersect.yEnd - ray.emittingPoint.y, 2));
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
        //if the previous ray part does not have a normal, break (the ray is outside the canvas)
        if(rayParts.length > 0 && !rayParts[rayParts.length - 1].normals)
            return;

        let x1 = ray.RayParts.length > 0 ? ray.RayParts[ray.RayParts.length - 1].xEnd : ray.emittingPoint.x;
        let y1 = ray.RayParts.length > 0 ? ray.RayParts[ray.RayParts.length - 1].yEnd : ray.emittingPoint.y;
        const x2 = x1 + 10000 * Math.cos(this.angleRadians);
        const y2 = y1 + 10000 * Math.sin(this.angleRadians);
        rayParts.push({xStart: x1, yStart: y1, xEnd: x2, yEnd: y2});
    }

    ray.RayParts = rayParts;
}

Ray.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.h}, {x: this.x, y: this.y + this.h}];
    const rot = this.points = rotatePoints(this.points, this.angleRadians);
    this.emittingPoint = {x: (rot[1].x + rot[2].x) / 2, y: (rot[1].y + rot[2].y) / 2};
}

Ray.prototype.calculateRefractedAngle = function(n1, n2, angleIncidence) {
    // Convert angle to radians for calculations
    const radiansIncidence = angleIncidence * Math.PI / 180;

    // Check if n2 is greater than n1 (critical angle check)
    if (n2 > n1) {
        const criticalAngle = Math.asin(n1 / n2) * 180 / Math.PI;
        if (angleIncidence > criticalAngle) {
            throw new Error("Angle of incidence exceeds critical angle for total internal reflection");
        }
    }

    // Apply Snell's law and convert back to degrees
    const angleRefraction = Math.asin(n1 * Math.sin(radiansIncidence) / n2) * 180 / Math.PI;

    // Calculate angle to be added
    const angleToAdd = angleRefraction - angleIncidence;

    return {
        angleRefraction,
        angleToAdd,
    };
};

Ray.prototype.calculateCriticalAngle = function(n1, n2) {  // Check if n1 is greater than n2 (critical angle requires n1 > n2)
    if (n1 <= n2) {
        console.error("Material A (n1) must have a higher refractive index than material B (n2), but if we switch the values this would be the ouput:");
        return Math.asin(n1 / n2) * 180 / Math.PI;
    }
    // Apply formula for critical angle and convert to degrees
    return Math.asin(n2 / n1) * 180 / Math.PI;
}