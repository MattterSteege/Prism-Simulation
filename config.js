/*===============================================================================================================*/
//an array of objects that define different shapes
/*===============================================================================================================*/
const shapes = [];

shapes.push({
    type: "lamp",
    x: 10,
    y: 100,
    lightPointer_x: 0,
    lightPointer_y: 0,
    rotation: 45, //in degrees
    width: 90,
    height: 30,
    fill: true,
    isDragging: false,
    points: []
});

// shapes.push({
//     type: "triangle",
//     x: 250,
//     y: 100,
//     rotation: 0, //in degrees
//     width: 100,
//     height: 100,
//     fill: false,
//     isDragging: false,
//     points: [],
//
//     //physics data
//     refractive_index : 1.5, //glass refractive
// });

shapes.push({
    type: "square",
    x: 275,
    y: 300,
    rotation: 0, //in degrees
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

    current_refractive_index: 1, //air refractive

    wavelength: 687, //in nm
});

/*===============================================================================================================*/
//User data
/*===============================================================================================================*/
let user = {
    mouseX: 0,
    mouseY: 0,
    showNormals: true,
    maxLightCalculations: 2,
    shapesColor: "#000000",
    air_refractive_index: 1,
}