/*===============================================================================================================*/
//an array of objects that define different shapes
/*===============================================================================================================*/
const shapes = [];

shapes.push({
    type: "lamp",
    x: 15,
    y: 500,
    lightPointer_x: 0,
    lightPointer_y: 0,
    rotation: 0, //in degrees
    width: 90,
    height: 30,
    fill: true,
    isDragging: false,
    points: []
});

shapes.push({
    type: "triangle",
    x: 275,
    y: 465,
    rotation: 0.01, //in degrees
    width: 100,
    height: 100,
    equilateral: true,
    sideLength: 100,
    fill: false,
    isDragging: false,
    points: [],

    //physics data
    refractive_index : 1.5, //glass refractive
});

shapes.push({
    type: "square",
    x: 275,
    y: 100,
    rotation: 45, //in degrees
    width: 100,
    height: 100,
    fill: false,
    isDragging: false,
    points: [],

    //physics data
    refractive_index : 1.5, //glass refractive
});

/*===============================================================================================================*/
//an array of objects that define different light beams
/*===============================================================================================================*/
const lightBeams = [];

lightBeams.push({
    lightbeam: [],

    insidePrism: false,

    current_refractive_index: 1, //air refractive

    wavelength: 687, //in nm
});

/*===============================================================================================================*/
//User data
/*===============================================================================================================*/
let user = {
    mouseX: 0,
    mouseY: 0,
    showNormals: false,
    showDebug: true,
    maxLightCalculations: 5,
    shapesColor: "#000000",
    global_refractive_index: 1,
}