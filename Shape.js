function Shape() {}

Shape.prototype.intersectRay = function(ray, shape) {
    const angleRadians = ray.angleRadians;
    //if ray.Rayparts is not empty, then use the last point as the start point
    let x1 = ray.RayParts.length > 0 ? ray.RayParts[ray.RayParts.length - 1].xEnd : ray.emittingPoint.x;
    let y1 = ray.RayParts.length > 0 ? ray.RayParts[ray.RayParts.length - 1].yEnd : ray.emittingPoint.y;
    x1 += 0.0001 * Math.cos(angleRadians);
    y1 += 0.0001 * Math.sin(angleRadians);
    const x2 = x1 + 10000 * Math.cos(angleRadians);
    const y2 = y1 + 10000 * Math.sin(angleRadians);

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
        return (intersection.xEnd - x1) * Math.cos(angleRadians) + (intersection.yEnd - y1) * Math.sin(angleRadians) > 0;
    });

    return intersections;

    function intersectLines(x1, y1, x2, y2, emittingPointX, emittingPointY, endPointX, endPointY) {
        // Calculate slopes
        let m1 = (y2 - y1) / (x2 - x1);
        let m2 = (endPointY - emittingPointY) / (endPointX - emittingPointX);

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
        let xIntersection = (m1 * x1 - m2 * emittingPointX + emittingPointY - y1) / (m1 - m2);
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
        angle -= 90;
        angle %= 360;
        angle = DegreesToRadians(angle);

        let normal = [{x1: xIntersection, y1: yIntersection, x2: xIntersection + 50 * Math.cos(angle), y2: yIntersection + 50 * Math.sin(angle)}, {x1: xIntersection, y1: yIntersection, x2: xIntersection + 50 * Math.cos(angle + Math.PI), y2: yIntersection + 50 * Math.sin(angle + Math.PI)}];

        //check which is pointing to emittingPointX, emittingPointY (closest)
        let distance1 = Math.sqrt(Math.pow(normal[0].x2 - emittingPointX, 2) + Math.pow(normal[0].y2 - emittingPointY, 2));
        let distance2 = Math.sqrt(Math.pow(normal[1].x2 - emittingPointX, 2) + Math.pow(normal[1].y2 - emittingPointY, 2));

        return {
            xStart: emittingPointX,
            yStart: emittingPointY,
            xEnd: xIntersection,
            yEnd: yIntersection,
            normal: (distance1 < distance2) ? normal[0] : normal[1]
        };
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