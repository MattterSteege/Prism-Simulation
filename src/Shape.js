function Shape() {}

Shape.prototype.intersectRay = function(ray, shape) {
    //ray
    const angleRadians = Math.atan2(ray.to.y - ray.from.y, ray.to.x - ray.from.x);
    const tinyMovement = 0.1; // Define a very small movement value
    const x1 = ray.from.x + tinyMovement * Math.cos(angleRadians); // Move x1 slightly closer to x2
    const y1 = ray.from.y + tinyMovement * Math.sin(angleRadians); // Move y1 slightly closer to y2
    const x2 = ray.to.x;
    const y2 = ray.to.y;


    //shape
    const points = shape.points;
    const n = points.length;

    let intersections = [];

    if (n > 2) {
        //loop through all the edges
        let _x1, _y1, _x2, _y2,
            _x3, _y3, _x4, _y4;

        for (let i = 0; i < n; i++) {
            _x1 = points[i].x;
            _y1 = points[i].y;
            _x2 = points[(i + 1) % n].x;
            _y2 = points[(i + 1) % n].y;

            _x3 = x1;
            _y3 = y1;
            _x4 = x2;
            _y4 = y2;

            const intersection = VectorIntersectsVector(_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4);
            if (intersection) intersections.push(intersection);
        }
    }

    if (n === 2) {
        //loop through all the edges
        let _x1, _y1, _x2, _y2,
            _x3, _y3, _x4, _y4;

        _x1 = points[0].x;
        _y1 = points[0].y;
        _x2 = points[1].x;
        _y2 = points[1].y;

        _x3 = x1;
        _y3 = y1;
        _x4 = x2;
        _y4 = y2;

        const intersection = VectorIntersectsVector(_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4);
        if (intersection) intersections.push(intersection);
    }

    if (intersections.length === 0) {
        return;
    }

    let closestIntersection = null;
    let closestDistance = 10000;

    intersections.forEach((intersection) => {
        const distance = Math.sqrt(Math.pow(intersection.x - x1, 2) + Math.pow(intersection.y - y1, 2));
        if (distance < closestDistance) {
            closestIntersection = intersection;
            closestDistance = distance;
        }
    });

    //get the of the ray from [closestIntersection] to [from]
    const angleOfRay = normalizeDegreeAngle(RadiansToDegrees(Math.atan2(y1 - closestIntersection.y, x1 - closestIntersection.x)));
    const normal1 = normalizeDegreeAngle(closestIntersection.normals[0]);
    const normal2 = normalizeDegreeAngle(closestIntersection.normals[1]);

    //check which is closer and set closestIntersection.normals to that
    if (getClosestNumber(angleOfRay, [normal1, normal2]) === normal1) {
        closestIntersection.normals = normal1;
    } else {
        closestIntersection.normals = normal2;
    }

    //check if the ray is hitting the shape from the inside


    return {
        from: {
            x: x1,
            y: y1
        },
        to: {
            x: closestIntersection.x,
            y: closestIntersection.y
        },
        shape: shape,
        normal: closestIntersection.normals
    };

    function VectorIntersectsVector(x1, y1, x2, y2, x3, y3, x4, y4) {
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        const angleDegrees1 = RadiansToDegrees(Math.atan2(y2 - y1, x2 - x1)) + 90;
        const angleDegrees2 = RadiansToDegrees(Math.atan2(y2 - y1, x2 - x1)) - 90;


        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1),
                normals: [
                    angleDegrees1,
                    angleDegrees2
                ]
            };
        }
    }
}

Shape.prototype.contains = function(mx, my) {
    // Check if a point (mx, my) is inside a polygon defined by an array of points
    const points = this.points;

    let isInside = false;
    const n = points.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = points[i].x;
        const yi = points[i].y;
        const xj = points[j].x;
        const yj = points[j].y;

        const intersect =
            ((yi > my) !== (yj > my)) &&
            (mx < (xj - xi) * (my - yi) / (yj - yi) + xi);

        if (intersect) {
            isInside = !isInside;
        }
    }

    return isInside;
}

Shape.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    console.log("general Stroke")
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    this.draw(ctx);
    ctx.stroke();
}