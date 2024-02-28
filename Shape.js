function Shape() {}

Shape.prototype.intersectRay = function(ray, shape) {
    const angleRadians = ray.angleRadians;
    const x1 = ray.emittingPoint.x;
    const y1 = ray.emittingPoint.y;
    const x2 = ray.emittingPoint.x + 10000 * Math.cos(angleRadians);
    const y2 = ray.emittingPoint.y + 10000 * Math.sin(angleRadians);

    let intersections = [];

    if (shape.points.length > 2) {
        //check if the ray intersects x1y1 to x2y2
        shape.points.forEach(function(point, index){
            const nextIndex = index === shape.points.length - 1 ? 0 : index + 1;

            //check if the ray intersects x1y1 to x2y2
            const intersection = intersectLines(point.x, point.y, shape.points[nextIndex].x, shape.points[nextIndex].y, x1, y1, x2, y2);
            if(intersection){
                intersections.push(intersection);
            }
        });
    }
    else if (shape.points.length === 2) {
        const intersection = intersectLines(shape.points[0].x, shape.points[0].y, shape.points[1].x, shape.points[1].y, x1, y1, x2, y2);
        if(intersection){
            intersections.push(intersection);
        }
    }

    if(intersections.length === 0){
        return null;
    }

    //if the intersection is behind the ray, then remove it
    intersections = intersections.filter(function(intersection){
        return (intersection.x - x1) * Math.cos(angleRadians) + (intersection.y - y1) * Math.sin(angleRadians) > 0;
    });

    return intersections;

    function intersectLines(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Calculate slopes
        let m1 = (y2 - y1) / (x2 - x1);
        let m2 = (y4 - y3) / (x4 - x3);

        //if m1 is infinity or -infinity (vertical line) then set m1 to Number.MAX_VALUE
        if(m1 === Infinity || m1 === -Infinity){
            m1 = 1_000_000_000;
        }
        //if m2 is infinity or -infinity (vertical line) then set m2 to Number.MAX_VALUE
        if(m2 === Infinity || m2 === -Infinity){
            m2 = 1_000_000_000;
        }

        // Check if lines are parallel (no intersection)
        if (m1 === m2)
            return null;

        // Calculate intersection point
        let xIntersection = (m1 * x1 - m2 * x3 + y3 - y1) / (m1 - m2);
        let yIntersection = m1 * (xIntersection - x1) + y1;

        //check if xIntersection is within the point range
        if(x1 < x2 && (xIntersection < x1 || xIntersection > x2)){
            return null;
        }
        if(x1 > x2 && (xIntersection > x1 || xIntersection < x2)){
            return null;
        }
        if(y1 < y2 && (yIntersection < y1 || yIntersection > y2)){
            return null;
        }
        if(y1 > y2 && (yIntersection > y1 || yIntersection < y2)){
            return null;
        }

        //create a normal and follow this step plan:
        //1. get the angle of the line
        //2. add 90 degrees to the angle
        //3. draw 2 lines from the intersection point to the left and right
        //4. check which of the goes in the direction of the start point of the ray
        //5. log all the data from this step plan

        let angle = Math.atan2(y2 - y1, x2 - x1); //angle in radians
        angle = RadiansToDegrees(angle); //angle in degrees
        angle += 90;
        angle %= 360;
        angle = DegreesToRadians(angle);

        let normal = [{x1: xIntersection, y1: yIntersection, x2: xIntersection + 50 * Math.cos(angle), y2: yIntersection + 50 * Math.sin(angle)}, {x1: xIntersection, y1: yIntersection, x2: xIntersection + 50 * Math.cos(angle + Math.PI), y2: yIntersection + 50 * Math.sin(angle + Math.PI)}];

        let distance1 = Math.sqrt(Math.pow(normal[0].x1 - x1, 2) + Math.pow(normal[0].y1 - y1, 2));
        let distance2 = Math.sqrt(Math.pow(normal[1].x1 - x1, 2) + Math.pow(normal[1].y1 - y1, 2));
        let distance3 = Math.sqrt(Math.pow(normal[0].x2 - x1, 2) + Math.pow(normal[0].y2 - y1, 2));
        let distance4 = Math.sqrt(Math.pow(normal[1].x2 - x1, 2) + Math.pow(normal[1].y2 - y1, 2));

        let distance = Math.min(distance1, distance2, distance3, distance4);

        let closestNormal = null;
        if(distance === distance1){
            closestNormal = normal[0];
        }
        else if(distance === distance2){
            closestNormal = normal[1];
        }
        else if(distance === distance3){
            closestNormal = normal[0];
        }
        else if(distance === distance4){
            closestNormal = normal[1];
        }

        return { x: xIntersection, y: yIntersection, normal: closestNormal };
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