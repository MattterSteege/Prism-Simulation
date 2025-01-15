//Ray class
Ray.prototype = new Shape();
Ray.prototype.constructor = Ray;
function Ray(x, y, angle, waveLength, fill, lightColorInternal) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = 50;
    this.h = 20;
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
    this.waveLength = waveLength || 500;
    this.fill = fill || '#AAAAAA';
    this.lightColorInternal = lightColorInternal || null;

    this.updatePoints();

    this.isInsideObject = false;
}

let check = 0;

// Draws this line to a given context
Ray.prototype.draw = async function (ctx) {
    this.updatePoints();
    let rayParts = this.calculateRay(s.shapes);

    check = Math.random();

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
    for (const rayPart of rayParts) {
        const i = rayParts.indexOf(rayPart);
        if (CurrentCheck !== check) continue;
        // if (user.doStagedDraw !== 0)
        //     await delay(user.doStagedDraw);


        ctx.beginPath();
        ctx.strokeStyle = this.lightColorInternal || RGBToHex(nmToRGB(this.waveLength));

        ctx.moveTo(rayPart.from.x, rayPart.from.y);
        ctx.lineTo(rayPart.to.x, rayPart.to.y);
        ctx.stroke();
        ctx.closePath();

        if (user.showNormals && rayPart.normal) {
            //the angle of the normal is rayPart.normal
            const length = 50;

            const x2 = rayPart.to.x + length * Math.cos(rayPart.normal * Math.PI / 180);
            const y2 = rayPart.to.y + length * Math.sin(rayPart.normal * Math.PI / 180);

            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(rayPart.to.x, rayPart.to.y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

Ray.prototype.calculateRay = function(shapes){
    let rayParts = [];
    const angleRadians = DegreesToRadians(this.angleDegrees);
    rayParts.push({from: this.emittingPoint, to: {x: this.emittingPoint.x + 10000 * Math.cos(angleRadians), y: this.emittingPoint.y + 10000 * Math.sin(angleRadians)}});

    let isInsideObject = this.isInsideObject;

    for (let i = 0; i < user.maxLightBounces; i++) {
        let closestIntersection = null;
        let closestShape = null;
        let closestDistance = 10000;
        let closestNormals = null;

        let intersections = [];

        const lastRayPart = rayParts[rayParts.length - 1];
        shapes.forEach((shape) => {
            const intersection = shape.intersectRay(lastRayPart, shape);
            if (intersection)
                intersections.push(intersection);
        });

        if(intersections.length === 0) break;

        intersections.forEach((intersection) => {
            var skip = false;
            shapes.forEach((shape) => {
                if (shape === intersection.shape) return;
                if (shape.contains(intersection.to.x, intersection.to.y)) {
                    skip = true;
                }
            });
            if (skip) return;
            const distance = Math.sqrt(Math.pow(intersection.to.x - intersection.from.x, 2) + Math.pow(intersection.to.y - intersection.from.y, 2));
            if (distance < closestDistance) {
                closestIntersection = intersection;
                closestDistance = distance;
                closestShape = intersection.shape;
                closestNormals = intersection.normal;
            }
        });

        if (closestIntersection) {
            rayParts[rayParts.length - 1] = closestIntersection;
        } else {
            rayParts[rayParts.length - 1] = {from: this.emittingPoint, to: {x: this.emittingPoint.x + 10000 * Math.cos(angleRadians), y: this.emittingPoint.y + 10000 * Math.sin(angleRadians)}};
            break;
        }

        //isInsideObject is true when the vector's center is inside an object
        isInsideObject = false;
        shapes.forEach((shape) => {
            const x_center = (closestIntersection.from.x - closestIntersection.to.x) / 2;
            const y_center = (closestIntersection.from.y - closestIntersection.to.y) / 2;
            const x = closestIntersection.to.x + x_center;
            const y = closestIntersection.to.y + y_center;
            if (shape.contains(x, y)) {
                isInsideObject = true;
            }
        });

        const angle_normal = closestNormals
        const angle_ray = normalizeDegreeAngle(RadiansToDegrees(Math.atan2(closestIntersection.from.y - closestIntersection.to.y, closestIntersection.from.x - closestIntersection.to.x)));
        const diff = angle_normal - angle_ray
        const nextRefractionAngle = this.calculateRefractedAngle(isInsideObject ? getSellmeierValue(this.waveLength) : getAirIndex(this.waveLength) , isInsideObject ? getAirIndex(this.waveLength) : getSellmeierValue(this.waveLength), diff)
        rayParts[rayParts.length - 1].refraction = {nextRefractionAngle, diff, angle_ray, angle_normal};

        if (!nextRefractionAngle.totalInteralReflection){
            let newAngle = normalizeDegreeAngle(angle_normal + 180 + (nextRefractionAngle.angleToAdd * -1));
            let newRay = {
                from: closestIntersection.to,
                to: {
                    x: closestIntersection.to.x + 10000 * Math.cos(newAngle * Math.PI / 180),
                    y: closestIntersection.to.y + 10000 * Math.sin(newAngle * Math.PI / 180),
                }
            }

            rayParts.push(newRay);
        }
        else {
            let newAngle = normalizeDegreeAngle(angle_normal + diff);
            let newRay = {
                from: closestIntersection.to,
                to: {
                    x: closestIntersection.to.x + 10000 * Math.cos(newAngle * Math.PI / 180),
                    y: closestIntersection.to.y + 10000 * Math.sin(newAngle * Math.PI / 180),
                }
            }

            rayParts.push(newRay);
        }

        isInsideObject = !isInsideObject;
    }

    if (rayParts.length === 0) {
        rayParts.push({from: this.emittingPoint, to: {x: this.emittingPoint.x + 10000 * Math.cos(angleRadians), y: this.emittingPoint.y + 10000 * Math.sin(angleRadians)}});
    }

    this.RayParts = rayParts;
    return rayParts;
}

Ray.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.h}, {x: this.x, y: this.y + this.h}];
    const rot = this.points = rotatePoints(this.points, this.angleDegrees);
    this.emittingPoint = {x: (rot[1].x + rot[2].x) / 2, y: (rot[1].y + rot[2].y) / 2};
}

Ray.prototype.calculateRefractedAngle = function(n1, n2, angleIncidence) {
    if (Math.abs(n2 - n1) < 0.0001) console.log(n1, n2, angleIncidence)
    // Convert angle to radians for calculations
    const isNegative = angleIncidence < 0;
    angleIncidence = Math.abs(angleIncidence);

    // Ensure angleIncidence is within valid range (0 to 90 degrees)
    angleIncidence = Math.min(angleIncidence, 90);

    const radiansIncidence = angleIncidence * Math.PI / 180;

    // Check if n2 is greater than n1 (critical angle check)
    if (n2 < n1) {
        const criticalAngle = this.calculateCriticalAngle(n1, n2);
        //console.log(angleIncidence, criticalAngle);
        if (angleIncidence > criticalAngle) {
            return {
                totalInteralReflection: true
            }
        }
    }

    // Apply Snell's law and convert back to degrees
    const angleRefraction = Math.asin(n1 * Math.sin(radiansIncidence) / n2) * 180 / Math.PI;

    //console.log(n1, n2, angleIncidence, angleRefraction, isNegative);

    return {
        totalInteralReflection: false,
        angleToAdd: isNegative ? -angleRefraction : angleRefraction
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