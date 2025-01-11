// ./src/LightDispersion.js
//Part of this code has been "borrowed" from https://github.com/phetsims/bending-light/blob/main/js/common/model/DispersionFunction.ts

const referenceWavelength = 500;

/**
 * Calculates the Sellmeier value for a given wavelength using Sellmeier equation.
 *
 * @param {number} wavelength - The wavelength for which Sellmeier value is to be calculated (nm).
 * @returns {number} - The Sellmeier value for the given wavelength.
 */
function getSellmeierValue(wavelength) {
    wavelength = wavelength * 1E-9; // Convert nm to m
    const L2 = wavelength * wavelength
    const B1 = 1.03961212;
    const B2 = 0.231792344;
    const B3 = 1.01046945;

    // Constants for converting to metric
    const C1 = 6.00069867E-3 * 1E-12; //
    const C2 = 2.00179144E-2 * 1E-12;
    const C3 = 1.03560653E2 * 1E-12;

    // Calculate the Sellmeier value using Sellmeier equation
    return Math.sqrt( 1 + B1 * L2 / ( L2 - C1 ) + B2 * L2 / ( L2 - C2 ) + B3 * L2 / ( L2 - C3 ) );
}

/**
 * Calculate the air index based on the wavelength
 * @param {number} wavelength - The wavelength in meters
 * @returns {number} - The air index
 */
function getAirIndex(wavelength) {
    return 1 +
        5792105E-8 / ( 238.0185 - Math.pow( wavelength * 1E6, -2 ) ) +
        167917E-8 / ( 57.362 - Math.pow( wavelength * 1E6, -2 ) );
}

/*
    With the above formulas, we can calculater the Sellmeier value for a given wavelength and interpolate between them.
 */

/**
 * See class-level documentation for an explanation of this algorithm
 * @param wavelength - wavelength in meters
 */
function getIndexOfRefraction( wavelength, refractiveIndex ) {

    // get the reference values
    const nAirReference = this.getAirIndex( referenceWavelength );
    const nGlassReference = this.getSellmeierValue( referenceWavelength );

    // determine the mapping and make sure it is in a good range
    const delta = nGlassReference - nAirReference;

    // 1 to 2,42 (air to diamond)
    let x = ( refractiveIndex - 1 ) / ( 1 + refractiveIndex * delta );
    //x = Utils.clamp( x, 0, Number.POSITIVE_INFINITY );
    x = Math.max( Math.min( x, 1 ), 0 );

    // take a linear combination of glass and air equations
    return x * this.getSellmeierValue( wavelength ) + ( 1 - x ) * this.getAirIndex( wavelength );
}

// ./src/config.js
const _user = {
    showDebug: false,
    showNormals: false,
    showIntersections: false,
    AmountOfRays: 100, //25: meh pc, 50: normal pc, 100: good pc, 250: beast pc
    doStagedDraw: 0, //0 is off !0 is the ms to wait before drawing the next ray


    maxLightBounces: 25,
}

const handler = {
    get(target, key) {
        if(typeof target[key] === "object" && target[key] !== null) {
            return new Proxy(target[key], handler)
        }
        return target[key]
    },
    set(target, prop, value) {
        target[prop] = value;
        s.valid = false;

        if(target.showDebug)
            console.log(`Setting ${prop} to ${value}`)
    }
}

let user = new Proxy(_user, handler)

// ./src/utils.js
function nmToRGB(wavelength){
    var Gamma = 0.80,
        IntensityMax = 255,
        factor, red, green, blue;
    if((wavelength >= 380) && (wavelength<440)){
        red = -(wavelength - 440) / (440 - 380);
        green = 0.0;
        blue = 1.0;
    }else if((wavelength >= 440) && (wavelength<490)){
        red = 0.0;
        green = (wavelength - 440) / (490 - 440);
        blue = 1.0;
    }else if((wavelength >= 490) && (wavelength<510)){
        red = 0.0;
        green = 1.0;
        blue = -(wavelength - 510) / (510 - 490);
    }else if((wavelength >= 510) && (wavelength<580)){
        red = (wavelength - 510) / (580 - 510);
        green = 1.0;
        blue = 0.0;
    }else if((wavelength >= 580) && (wavelength<645)){
        red = 1.0;
        green = -(wavelength - 645) / (645 - 580);
        blue = 0.0;
    }else if((wavelength >= 645) && (wavelength<781)){
        red = 1.0;
        green = 0.0;
        blue = 0.0;
    }else{
        red = 0.0;
        green = 0.0;
        blue = 0.0;
    }
    // Let the intensity fall off near the vision limits
    if((wavelength >= 380) && (wavelength<420)){
        factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
    }else if((wavelength >= 420) && (wavelength<701)){
        factor = 1.0;
    }else if((wavelength >= 701) && (wavelength<781)){
        factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
    }else{
        factor = 0.0;
    }
    if (red !== 0){
        red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
    }
    if (green !== 0){
        green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
    }
    if (blue !== 0){
        blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
    }
    return [red,green,blue];
}

function RGBToHex(rgb){
    var hex = "#";
    for (var i = 0; i < 3; i++){
        var h = rgb[i].toString(16);
        if (h.length < 2){
            h = "0" + h;
        }
        hex += h;
    }
    return hex;
}

function rotatePointsAroundCenter(points, angle){
    //angle is in degrees
    var angleRadians = angle * Math.PI / 180;
    //get the center of the points (average of all points)
    var centerX = 0;
    var centerY = 0;
    points.forEach(function(point){
        centerX += point.x;
        centerY += point.y;
    });
    centerX /= points.length;
    centerY /= points.length;
    //rotate the points around the center
    var newPoints = [];
    points.forEach(function(point){
        var x = centerX + (point.x - centerX) * Math.cos(angleRadians) - (point.y - centerY) * Math.sin(angleRadians);
        var y = centerY + (point.x - centerX) * Math.sin(angleRadians) + (point.y - centerY) * Math.cos(angleRadians);
        newPoints.push({x: x, y: y});
    });
    return newPoints;
}

function rotatePoints(points, angleInDegrees) {
    const angleInRadians = DegreesToRadians(angleInDegrees);
    // Calculate the center of the points
    const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

    // Iterate through each point and apply rotation
    return points.map(point => {
        const x = centerX + (point.x - centerX) * Math.cos(angleInRadians) - (point.y - centerY) * Math.sin(angleInRadians);
        const y = centerY + (point.x - centerX) * Math.sin(angleInRadians) + (point.y - centerY) * Math.cos(angleInRadians);
        return {x, y};
    });
}

function rotatePointsXY(points, angleInRadians, x, y) {
     // Calculate the center of the points
     const centerX = x;
     const centerY = y;

     // Iterate through each point and apply rotation
    return points.map(point => {
         const x = centerX + (point.x - centerX) * Math.cos(angleInRadians) - (point.y - centerY) * Math.sin(angleInRadians);
         const y = centerY + (point.x - centerX) * Math.sin(angleInRadians) + (point.y - centerY) * Math.cos(angleInRadians);
         return {x, y};
     });
}

//==============================================================================
function DegreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

function RadiansToDegrees(radians){
    return radians * 180 / Math.PI;
}

//==============================================================================
function dotProduct(a, b){
    return a.x * b.x + a.y * b.y;
}

//==============================================================================
const delay = ms => new Promise(res => setTimeout(res, ms));

//==============================================================================
function normalizeDegreeAngle(angle){
    //make angle between 0 and 360 (-45 would be 315)
    while(angle <= 0){
        angle += 360;
    }
    while(angle >= 360){
        angle -= 360;
    }
    return angle;
}

//==============================================================================
function calculateTotalCalulations(){
    //shapes * user.maxLightBounces * rays
    var shapes = s.shapes.length;
    var rays = s.rays.length;
    var totalCalculations = user.maxLightBounces;
    return shapes * totalCalculations * rays;
}

//==============================================================================
function getClosestNumber(number, array) {
    var closest = array[0];
    var closestDiff = Math.abs(number - closest);
    for(var i = 1; i < array.length; i++){
        var diff = Math.abs(number - array[i]);
        if(diff < closestDiff){
            closest = array[i];
            closestDiff = diff;
        }
    }
    return closest;
}

//==============================================================================
//get the how good the pc is (0-100) based the speed it can calculate some obscure math function
function getPcSpeed(){
    var start = new Date().getTime();
    let x = 0;
    for(var i = 0; i < 1000; i++){
        for(var j = 0; j < 1000; j++) {
            x += Math.pow(i, j);
        }
    }
    console.log(x);
    var end = new Date().getTime();
    var time = end - start;
    var speed = 100 - Math.min(100, time / 100);
    return speed;
}



// ./src/Shape.js
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

// ./src/Text.js
Text.prototype = new Shape();
Text.prototype.constructor = Text;
function Text (x, y, font, fill, content) {
    this.x = x || 0;
    this.y = y || 0;
    this.font = font;
    this.fill = fill;
    this.w = content.length * 10;
    this.content = content;
    this.points = [{x: this.x, y: this.y+ 18}, {x: this.x + this.w, y: this.y+ 18}, {x: this.x + this.w, y: this.y + 20+ 18}, {x: this.x, y: this.y + 20+ 18}];
}

Text.prototype.draw = function(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.fill;
    var metrics = ctx.measureText(this.content);
    this.w = metrics.width;
    this.h = 20; //Nasty hack
    ctx.fillText(this.content, this.x, this.y);
}
Text.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y >= my) && (this.y + this.h >= my);
}

Text.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y- 18}, {x: this.x + this.w, y: this.y- 18}, {x: this.x + this.w, y: this.y + this.h- 18}, {x: this.x, y: this.y + this.h- 18}];
}

// ./src/Rectangle.js

//Rectangle Class
Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;
function Rectangle(x, y, w, h, angle, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
}
// Draws this shape to a given context
Rectangle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Rectangle.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
}

Rectangle.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.h}, {x: this.x, y: this.y + this.h}];
    this.points = rotatePoints(this.points, this.angleDegrees);
}

// ./src/Circle.js
const CircleResolutions = 1000;

//Class Circle
Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
function Circle(x, y, w, fill) {

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
}
// Draws this shape to a given context
Circle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
}

// Determine if a point is inside the shape's bounds
Circle.prototype.contains = function(mx, my) {
    //check if the point is inside the circle
    return (Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2) <= Math.pow(this.w, 2));
}

Circle.prototype.updatePoints = function(){
    this.points = [];
    for (var i = 0; i < CircleResolutions; i++){
        var angle = (i / CircleResolutions) * Math.PI * 2;
        this.points.push({x: this.x + this.w * Math.cos(angle), y: this.y + this.w * Math.sin(angle)});
    }
}

// ./src/Triangle.js
// Triangle Class
Triangle.prototype = new Shape();
Triangle.prototype.constructor = Triangle;

function Triangle(x, y, width, angle, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1; //equilateral triangle
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
    this.fill = fill || '#AAAAAA';

    this.updatePoints();}

// Draws this shape to a given context
Triangle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
};

Triangle.prototype.updatePoints = function(){
    const height = (Math.sqrt(3) / 2) * this.width;
    this.points = [{x: this.x, y: this.y + height}, {x: this.x + this.width, y: this.y + height}, {x: this.x + this.width / 2, y: this.y}];
    this.points = rotatePoints(this.points, this.angleDegrees);
}

// ./src/Line.js
//Line Class
Line.prototype = new Shape();
Line.prototype.constructor = Line;

function Line(x1, y1, length, w, angle, fill) {
    this.x = x1 || 0;
    this.y = y1 || 0;
    this.length = length || 1;
    this.w = w || 1;
    this.angleDegrees =  normalizeDegreeAngle(angle || 0);
    this.fill = fill || '#AAAAAA';

    this.updatePoints();
}
// Draws this shape to a given context
Line.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
}

Line.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y}, {x: this.x + this.w, y: this.y}, {x: this.x + this.w, y: this.y + this.length}, {x: this.x, y: this.y + this.length}];
    this.points = rotatePoints(this.points, this.angleDegrees);
}



// ./src/Ray.js
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

// ./src/dragging.js
function CanvasState(canvas) {
    // **** First some setup! ****
    console.log(canvas);
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn
    this.rays = [];  // the collection of ray sources
    this.dragging = false; // Keep track of when we are dragging
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // **** Then events! ****

    // This is an example of a closure!
    // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;

    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = myState.shapes;
        var l = shapes.length;
        for (var i = l-1; i >= 0; i--) {

            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.x;
                myState.dragoffy = my - mySel.y;
                myState.dragging = true;
                myState.selection = mySel;
                myState.valid = false;
                return;
            }
        }

        var rays = myState.rays;
        if (rays[0].contains(mx, my)) {
            myState.dragoffx = mx - rays[0].x;
            myState.dragoffy = my - rays[0].y;
            myState.dragging = true;
            myState.selection = rays[0];
            myState.valid = false;
            return;
        }

        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging && myState.selection.constructor.name !== 'Ray'){
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.selection.updatePoints();
            myState.valid = false; // Something's dragging so we must redraw
        }
        else if(myState.dragging && myState.selection.constructor.name === 'Ray'){
            const rays = myState.rays;
            rays.forEach(ray => {
                var mouse = myState.getMouse(e);
                ray.x = mouse.x - myState.dragoffx;
                ray.y = mouse.y - myState.dragoffy;
                ray.updatePoints();
                myState.valid = false;
            });
        }
    }, true);
    canvas.addEventListener('mouseup', function() {
        myState.dragging = false;
    }, true);

    //when user uses scroll wheel
    canvas.addEventListener('wheel', function(e) {
        //get which shape is under the mouse
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = myState.shapes;
        var rays = myState.rays;
        var l = shapes.length;
        for (var i = l-1; i >= 0; i--) {
            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                console.log(e.deltaY);
                mySel.angleDegrees += e.deltaY / 100;
                mySel.updatePoints();
                myState.valid = false;
            }
        }
        if (rays[0].contains(mx, my)) {
            rays.forEach(ray => {
                ray.angleDegrees += e.deltaY / 100;
                myState.valid = false;
            });
        }
    }, true);

    //when user uses 2 fingers to rotate


    // Add touch events
    canvas.addEventListener('touchstart', function(e) {
        // Prevent scrolling on touch devices
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    let lastTouches = [];

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }
        else if (e.touches.length === 2) {
            let touches = [];
            for (let i = 0; i < e.touches.length; i++) {
                touches.push({x: e.touches[i].clientX, y: e.touches[i].clientY});
            }
            if (lastTouches.length === 2) {
                let angle = Math.atan2(touches[0].y - touches[1].y, touches[0].x - touches[1].x) - Math.atan2(lastTouches[0].y - lastTouches[1].y, lastTouches[0].x - lastTouches[1].x);
                let rays = myState.rays;
                rays.forEach(ray => {
                    ray.angleDegrees += angle;
                    myState.valid = false;
                });
            }
            lastTouches = touches;
        }
    }, false);

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        var mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    this.interval = 10;
    setInterval(function() { myState.draw(); }, myState.interval);
}


CanvasState.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
}

CanvasState.prototype.addRay = function(ray) {
    this.rays.push(ray);
    this.valid = false;
}

CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var shapes = this.shapes;
        this.clear();

        // ** Add stuff you want drawn in the background all the time here **

        // draw all shapes
        var l = shapes.length;
        for (var i = 0; i < l; i++) {
            var shape = shapes[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (shape.x > this.width || shape.y > this.height ||
                shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
            shapes[i].draw(ctx);
        }

        // calulate the ray
        var rays = this.rays;
        var l = rays.length;
        for (var i = 0; i < l; i++) {
            var ray = rays[i];
            ray.draw(ctx);
            ray.calculateRay(shapes);
        }

        // ** Add stuff you want drawn on top all the time here **

        this.valid = true;
    }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}

var s = new CanvasState(document.getElementById('canvas'));
function init() {
    s.canvas.width = s.width = window.innerWidth - window.innerWidth * 0.15;
    s.canvas.height = s.height = window.innerHeight;

    s.addShape(new Triangle(300, 200, 700, 0,'#ffbe0b'));
    s.addShape(new Rectangle(200, 200, 100, 100,0,'#fb5607'));
    s.addShape(new Line(400, 200, 100, 5, 0, '#ff006e'));
    s.addShape(new Circle(600, 200, 50, '#8338ec'));
    //s.addShape(new Text(50, 50, '20px Arial', '#fff', 'Drag me!'));

    let multiplier = (700-400) / user.AmountOfRays;
    const x = 200;
    const y = 500;
    const angle = -10;
    const waveLength = 700;
    const fill = '#888';
    for (let i = 0; i < user.AmountOfRays; i++) {
        s.addRay(new Ray(x, y, angle, waveLength - (multiplier * i), fill));
    }
}

function reset() {
    s.shapes = [];
    s.rays = [];
    s.valid = false;
    init();
}

