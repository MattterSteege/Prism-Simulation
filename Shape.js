function Shape() {}

Shape.prototype.intersectRay = function(ray, shape) {
    const angleRadians = ray.angleRadians;
    const x1 = (ray.points[2].x + ray.points[1].x) / 2;
    const y1 = (ray.points[2].y + ray.points[1].y) / 2;
    const x2 = ((ray.points[2].x + ray.points[1].x) / 2) + Math.cos(angleRadians) * 10000;
    const y2 = ((ray.points[2].y + ray.points[1].y) / 2) + Math.sin(angleRadians) * 10000;

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

        return { x: xIntersection, y: yIntersection };
    }
}