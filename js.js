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

    //make it rotate
    const newCoords = rotateShape([{ x: t.x, y: t.y + t.height }, { x: t.x + t.width / 2, y: t.y }, { x: t.x + t.width, y: t.y + t.height }], t.rotation);

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
            lb.lightbeam = [];

            for (let i = 0; i < user.maxLightCalculations; i++) {
                if (i === 0) {
                    lamp.rotation %= 360;
                    const lightbeamnext = nextHit(lamp.lightPointer_x, lamp.lightPointer_y, degreeToRadians(lamp.rotation));

                    //the normal needs to be between 0 and 360
                    lightbeamnext.normal = lightbeamnext.normal % 360;
                    if (lightbeamnext.normal < 1e-9) lightbeamnext.normal = 0;
                    lightbeamnext.normal -= 180;

                    lightbeamnext.angleDifference = Math.abs(lamp.rotation - lightbeamnext.normal);

                    ctx.beginPath();
                    ctx.moveTo(lamp.lightPointer_x, lamp.lightPointer_y);
                    ctx.lineTo(lightbeamnext.x, lightbeamnext.y);
                    ctx.strokeStyle = hex;
                    ctx.stroke();

                    //add the angle of the lightbeam
                    lightbeamnext.angle = lamp.rotation;

                    if (user.showNormals) {
                        //make dotted line
                        ctx.beginPath();
                        let normal_x = lightbeamnext.x + 50 * Math.cos((lightbeamnext.normal + 180) * Math.PI / 180);
                        let normal_y =  lightbeamnext.y + 50 * Math.sin((lightbeamnext.normal + 180) * Math.PI / 180);
                        ctx.moveTo(lightbeamnext.x, lightbeamnext.y);
                        ctx.lineTo(normal_x, normal_y);
                        ctx.strokeStyle = "#0d35ff";
                        ctx.stroke();

                        ctx.moveTo(lightbeamnext.x, lightbeamnext.y);

                        //make the angle of the normal

                        if (lightbeamnext.normal > lightbeamnext.angleDifference) {
                            ctx.arc(lightbeamnext.x, lightbeamnext.y, 20, degreeToRadians(lightbeamnext.angle + 180), degreeToRadians(lightbeamnext.normal + 180));
                        }
                        else {
                            ctx.arc(lightbeamnext.x, lightbeamnext.y, 20, degreeToRadians(lightbeamnext.normal + 180), degreeToRadians(lightbeamnext.angle + 180));
                        }

                        ctx.stroke();
                    }

                    lb.lightbeam.push(lightbeamnext);
                }
            }
        });
    });
}

function nextHit(x, y, direction) {
    //find the next intersection, if any
    //check if there is an intersection with any of the shapes, if so return the x and y of the intersection
    let minDistance = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT);
    let nextShape = null;

    console.log(radiansToDegrees(direction))

    //calculate the next x and y without any intersection
    //direction is the angle in radians
    let nextX = x + WIDTH * Math.cos(direction);
    let nextY = y + WIDTH * Math.sin(direction);
    let nextNormal = 0;

    for (let i = 0; i < shapes.length; i++) {
        let s = shapes[i];
        if (s.type === "triangle" || s.type === "square") {

            let intersection = lineIntersect(x, y, direction, s.points);
            if (intersection != null) {
                let distance = Math.sqrt((x - intersection.x) * (x - intersection.x) + (y - intersection.y) * (y - intersection.y));
                if (distance < minDistance) {
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
        if (intersection != null) {
            intersections.push(intersection);

            let angle = (y3 - y2) / (x3 - x2);
            if (angle === Number.POSITIVE_INFINITY) angle = 90;
            else if (angle === Number.NEGATIVE_INFINITY) angle = 270;
            else angle = radiansToDegrees(Math.atan(angle));

            // //check if the normal is pointing in the right direction (towards the light)
            // let normal = (angle + 90) % 360;
            // let angleDifference = Math.abs(normal - direction_YToDegree(direction));
            // if (angleDifference > 180) angleDifference = 360 - angleDifference;
            // if (angleDifference > 90) angle = (angle + 180) % 360;
            // angle += 180;

            intersection.normal = angle + 90;

            //if intersection.normal is very small, then set it to 0
            if (intersection.normal < 1e-9) intersection.normal = 0;
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

function calculateNextAngle(normal, lastRefractiveIndex, currentRefractiveIndex, wavelength, angleOfAttack) {
    const angleOfIncidence = normal - angleOfAttack;
    const angleOfRefraction = Math.asin(lastRefractiveIndex * Math.sin(angleOfIncidence) / currentRefractiveIndex);
    return angleOfRefraction * 180 / Math.PI;
}

function angleBetween(startRadius, endRadius) {
    const angle = endRadius - startRadius;
    if (angle < 0) return 360 + angle;
    return angle;
}