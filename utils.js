//================================================================
// This file contains utility functions that are used throughout the project
//================================================================

//================================================================
// Rotate a shape
//================================================================
function rotateShape(points, degrees) {
    // Convert degrees to radians
    const radians = degrees * Math.PI / 180;

    // Find the center of the shape
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

    // Rotate each point around the center
    return points.map(point => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const newX = dx * Math.cos(radians) - dy * Math.sin(radians) + center.x;
        const newY = dx * Math.sin(radians) + dy * Math.cos(radians) + center.y;
        return {x: newX, y: newY};
    });
}

//================================================================
// Degrees to radians and vice versa
//================================================================
function degreeToDirection_Y(angle) {
    //take in an angle of degrees, and output the direction_y (the slope of the line)
    return Math.tan(angle * Math.PI / 180);
}

function direction_YToDegree(slope) {
    //take in the direction_y (the slope of the line), and output the angle of degrees
    return Math.atan(slope) * 180 / Math.PI;
}

function degreeToRadians(angle) {
    return angle * Math.PI / 180;
}

function radiansToDegrees(angle) {
    return angle * 180 / Math.PI;
}
//================================================================
// WaveLength to Hex
//================================================================
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