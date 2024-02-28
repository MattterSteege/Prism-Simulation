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

function rotatePoints(points, angleInRadians) {
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