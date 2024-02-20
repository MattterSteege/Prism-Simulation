// get canvas related references
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const BB = canvas.getBoundingClientRect();
const offsetX = BB.left;
const offsetY = BB.top;
let WIDTH = canvas.width;
let HEIGHT = canvas.height;

// drag related variables
let dragok = false;
let startX;
let startY;




// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;
//when the mousewheel is used, rotate the shapes
window.onscroll = myRotate;


function redraw() {
    draw();
    drawLight();
}

// draw a single rect
function rect(t) {

    const newCoords = rotateShape([{ x: t.x, y: t.y + t.height }, { x: t.x + t.width, y: t.y + t.height }, { x: t.x + t.width, y: t.y }, { x: t.x, y: t.y }], t.rotation);

    ctx.fillStyle = user.shapesColor;
    ctx.beginPath();
    ctx.moveTo(newCoords[0].x, newCoords[0].y);
    ctx.lineTo(newCoords[1].x, newCoords[1].y);
    ctx.lineTo(newCoords[2].x, newCoords[2].y);
    ctx.lineTo(newCoords[3].x, newCoords[3].y);
    ctx.closePath();

    t.lightPointer_x = (newCoords[1].x + newCoords[2].x) / 2;
    t.lightPointer_y = (newCoords[1].y + newCoords[2].y) / 2;

    if (t.fill)
        ctx.fill();
    else
    {
        ctx.strokeStyle = user.shapesColor;
        ctx.stroke();
    }

    t.points = newCoords;
}

//draw a single triangle
function triangle(t) {

    //if the triangle is equilateral
    if (t.equilateral) {
        let sideLength = t.sideLength;
        let height = Math.sqrt(3) / 2 * sideLength;

        const newCoords = rotateShape([{ x: t.x, y: t.y + height }, { x: t.x + sideLength / 2, y: t.y }, { x: t.x + sideLength, y: t.y + height }], t.rotation);

        ctx.fillStyle = user.shapesColor;
        ctx.beginPath();
        ctx.moveTo(newCoords[0].x, newCoords[0].y);
        ctx.lineTo(newCoords[1].x, newCoords[1].y);
        ctx.lineTo(newCoords[2].x, newCoords[2].y);
        ctx.closePath();
        if (t.fill)
            ctx.fill();
        else
        {
            ctx.strokeStyle = user.shapesColor;
            ctx.stroke();
        }

        t.points = newCoords;
    }
    else {
        const newCoords = rotateShape([{ x: t.x, y: t.y + t.height }, { x: t.x + t.width, y: t.y + t.height }, { x: t.x + t.width, y: t.y }], t.rotation);

        ctx.fillStyle = user.shapesColor;
        ctx.beginPath();
        ctx.moveTo(newCoords[0].x, newCoords[0].y);
        ctx.lineTo(newCoords[1].x, newCoords[1].y);
        ctx.lineTo(newCoords[2].x, newCoords[2].y);
        ctx.closePath();
        if (t.fill)
            ctx.fill();
        else
        {
            ctx.strokeStyle = user.shapesColor;
            ctx.stroke();
        }

        t.points = newCoords;
    }
}


// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    // redraw each shape in the shapes[] array
    for (let i = 0; i < shapes.length; i++) {
        // decide if the shape is a rect or circle
        // (it's a rect if it has a width property)
        if (shapes[i].type === "square") {
            rect(shapes[i]);
        } else if (shapes[i].type === "triangle") {
            triangle(shapes[i]);
        }
        else if (shapes[i].type === "lamp") {
            rect(shapes[i]);
        }
    }
}

function drawLight() {

    //for each "lamp"
    shapes.forEach((lamp) => {
        if (lamp.type !== "lamp") return;

        lightBeams.forEach((lb) => {
            var hex = RGBToHex(nmToRGB(lb.wavelength))
            let nextLightDirection = (lamp.rotation %= 360);
            lb.lightbeam = [];

            for (let i = 0; i < user.maxLightCalculations; i++) {
                if (i === 0) {
                    const lightbeamnext = nextHit(lamp.lightPointer_x, lamp.lightPointer_y, degreeToRadians(nextLightDirection));

                    ctx.beginPath();
                    ctx.moveTo(lamp.lightPointer_x, lamp.lightPointer_y);
                    ctx.lineTo(lightbeamnext.x, lightbeamnext.y);
                    ctx.strokeStyle = hex;
                    ctx.stroke();

                    //add the angle of the lightbeam
                    lightbeamnext.angle = lamp.rotation;
                    let normal = lightbeamnext.normal;
                    if (normal === undefined) return;
                    let angle = Math.atan2(normal.y2 - normal.y1, normal.x2 - normal.x1) * 180 / Math.PI;
                    let counterClockwise = angleBetween(degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180)) > 180;

                    if (user.showNormals) {
                        ctx.beginPath();
                        ctx.setLineDash([15, 5]);
                        ctx.moveTo(lightbeamnext.x, lightbeamnext.y);
                        ctx.lineTo(lightbeamnext.x + 50 * Math.cos(degreeToRadians(angle)), lightbeamnext.y + 50 * Math.sin(degreeToRadians(angle)));
                        ctx.strokeStyle = "#0d35ff";
                        ctx.stroke();
                        ctx.setLineDash([]);

                        //make an arc from the normal to the lightbeam (shortest distance)
                        ctx.beginPath();
                        ctx.arc(lightbeamnext.x, lightbeamnext.y, 50, degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180), counterClockwise);
                        ctx.strokeStyle = "#0d35ff";
                        ctx.stroke();
                    }

                    lb.lightbeam.push(lightbeamnext);

                    //log in degree it needs to be the same as thius: ctx.arc(lightbeamnext.x, lightbeamnext.y, 50, degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180), counterClockwise);
                    let start = angle;
                    let end = lightbeamnext.angle - 180;
                    let angleBetweenLines = end - start;
                    if (counterClockwise)
                        angleBetweenLines = 360 - angleBetweenLines;
                    angleBetweenLines %= 360;

                    console.log(angle, lightbeamnext.angle - 180, angleBetweenLines);
                    let lastRefractiveIndex = lb.current_refractive_index;
                    let NextRefractiveIndex = lightbeamnext.shape.refractive_index;
                    let wavelength = lb.wavelength;
                    let angleOfAttack = angleBetweenLines;

                    let nextAngle = Math.asin(lastRefractiveIndex * Math.sin(degreeToRadians(angleOfAttack)) / NextRefractiveIndex);
                    nextLightDirection = radiansToDegrees(nextAngle);

                    continue;
                }

                const lightbeamnext = nextHit(lb.lightbeam[i - 1].x, lb.lightbeam[i - 1].y, degreeToRadians(nextLightDirection));
                console.log(lightbeamnext);
                ctx.beginPath();
                ctx.moveTo(lb.lightbeam[i - 1].x, lb.lightbeam[i - 1].y);
                ctx.lineTo(lightbeamnext.x, lightbeamnext.y);
                ctx.strokeStyle = hex;
                ctx.stroke();

                //add the angle of the lightbeam
                lightbeamnext.angle = nextLightDirection;
                let normal = lightbeamnext.normal;
                if (normal === undefined) return;
                let angle = Math.atan2(normal.y2 - normal.y1, normal.x2 - normal.x1) * 180 / Math.PI;
                let counterClockwise = angleBetween(degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180)) > 180;

                if (user.showNormals) {
                    ctx.beginPath();
                    ctx.setLineDash([15, 5]);
                    ctx.moveTo(lightbeamnext.x, lightbeamnext.y);
                    ctx.lineTo(lightbeamnext.x + 50 * Math.cos(degreeToRadians(angle)), lightbeamnext.y + 50 * Math.sin(degreeToRadians(angle)));
                    ctx.strokeStyle = "#0d35ff";
                    ctx.stroke();
                    ctx.setLineDash([]);


                    //make a arc from the normal to the lightbeam (shortest distance)
                    ctx.beginPath();
                    ctx.arc(lightbeamnext.x, lightbeamnext.y, 50, degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180), counterClockwise);
                    ctx.strokeStyle = "#0d35ff";
                    ctx.stroke();
                }

                //log in degree it needs to be the same as thius: ctx.arc(lightbeamnext.x, lightbeamnext.y, 50, degreeToRadians(angle), degreeToRadians(lightbeamnext.angle - 180), counterClockwise);
                let start = angle;
                let end = lightbeamnext.angle - 180;
                let angleBetweenLines = end - start;
                if (counterClockwise)
                    angleBetweenLines = 360 - angleBetweenLines;
                angleBetweenLines %= 360;

                console.log(angle, lightbeamnext.angle - 180, angleBetweenLines);
                let lastRefractiveIndex = lb.current_refractive_index;
                let NextRefractiveIndex = lightbeamnext.shape.refractive_index;
                let wavelength = lb.wavelength;
                let angleOfAttack = angleBetweenLines;

                let nextAngle = Math.asin(lastRefractiveIndex * Math.sin(degreeToRadians(angleOfAttack)) / NextRefractiveIndex);
                nextLightDirection = radiansToDegrees(nextAngle);

                lb.lightbeam.push(lightbeamnext);
            }
        });
    });
}

function nextHit(x, y, direction) {
    //find the next intersection, if any
    //check if there is an intersection with any of the shapes, if so return the x and y of the intersection
    let minDistance = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT);
    let nextShape = null;

    //calculate the next x and y without any intersection
    //direction is the angle in radians
    let nextX = x + 10000 * Math.cos(direction);
    let nextY = y + 10000 * Math.sin(direction);
    let nextNormal = 0;

    for (let i = 0; i < shapes.length; i++) {
        let s = shapes[i];
        if (s.type === "triangle" || s.type === "square") {

            let intersection = lineIntersect(x, y, direction, s.points);
            if (intersection != null) {
                let distance = Math.sqrt((x - intersection.x) * (x - intersection.x) + (y - intersection.y) * (y - intersection.y));
                if (distance < minDistance && distance > 0.001) {
                    minDistance = distance;
                    nextShape = s;
                    nextX = intersection.x;
                    nextY = intersection.y;
                    nextNormal = intersection.normal;
                }
            }
        }
    }

    if (nextShape != null) {
        return {
            x: nextX,
            y: nextY,
            shape: nextShape,
            normal: nextNormal
        };
    }
    else {
        return {
            x: nextX,
            y: nextY
        };
    }
}

//x1: is the x coordinate of the starting point
//y1: is the y coordinate of the starting point
//direction: is the angle in radians
//array of points: is the array of points that define the shape
function lineIntersect(x1, y1, direction, points) {
    let intersections = [];
    for (let i = 0; i < points.length; i++) {
        let x2 = points[i].x;
        let y2 = points[i].y;
        let x3 = points[(i + 1) % points.length].x;
        let y3 = points[(i + 1) % points.length].y;



        let intersection = lineIntersect2(x1, y1, direction, x2, y2, x3, y3);

        if (intersection !== null) {
            intersections.push(intersection);

            //get the middel of the line
            let middle_x = (x2 + x3) / 2;
            let middle_y = (y2 + y3) / 2;

            //make 2 lines, inward and outward
            let center = GetCenterFromPoints(points);
            let normal = Math.atan2(center.y - middle_y, center.x - middle_x) * 180 / Math.PI;

            let normal_x1 = (x2 + x3) / 2;
            let normal_y1 = (y2 + y3) / 2;
            let normal_x2 = normal_x1 + 20 * Math.cos((normal + 180) * Math.PI / 180);
            let normal_y2 = normal_y1 + 20 * Math.sin((normal + 180) * Math.PI / 180);
            intersection.normal = { x1: normal_x1, y1: normal_y1, x2: normal_x2, y2: normal_y2};

            //draw the normal

            if (user.showDebug) {
                ctx.beginPath();
                ctx.moveTo(middle_x, middle_y);
                ctx.lineTo(normal_x2, normal_y2);
                ctx.strokeStyle = "#00ff00";
                ctx.stroke();

                //direction of the normal: [point] + [cos(normal), sin(normal)] * 20 //20 is the length of the normal
            }
        }
    }

    if (intersections.length === 0) return null;

    let minDistance = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT);
    let minIntersection = null;

    for (let i = 0; i < intersections.length; i++) {
        let distance = Math.sqrt((x1 - intersections[i].x) * (x1 - intersections[i].x) + (y1 - intersections[i].y) * (y1 - intersections[i].y));
        if (distance < minDistance) {
            minDistance = distance;
            minIntersection = intersections[i];
        }
    }
    return minIntersection;
}

function lineIntersect2(x1, y1, direction, x2, y2, x3, y3) {
    // Calculate slopes of the two lines
    const m1 = Math.tan(direction);
    const m2 = (y3 - y2) / (x3 - x2);

    // Check if the slopes are not equal (lines are not parallel)
    if (m1 !== m2) {
        // Calculate the intersection point
        const xIntersect = (m1 * x1 - m2 * x2 + y2 - y1) / (m1 - m2);
        const yIntersect = m1 * (xIntersect - x1) + y1;

        // Check if the intersection point lies on the vector (x2, y2) to (x3, y3)
        if (
            (xIntersect >= Math.min(x2, x3) && xIntersect <= Math.max(x2, x3)) &&
            (yIntersect >= Math.min(y2, y3) && yIntersect <= Math.max(y2, y3))
        ) {
            return { x: xIntersect, y: yIntersect, intersects: true };
        }
    }

    // Lines are either parallel or do not intersect
    return { intersects: false };
}

function angleBetween(startRadius, endRadius) {
    const angle = endRadius - startRadius;
    if (angle < 0) return 360 + angle;
    return angle;
}

function GetCenterFromPoints(points) {
    const center = {
        x: 0,
        y: 0,
    };
    for (const point of points) {
        center.x += point.x;
        center.y += point.y;
    }
    center.x /= points.length;
    center.y /= points.length;
    return center;
}