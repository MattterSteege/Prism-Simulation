function CanvasState(canvas) {
    // **** First some setup! ****

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
    s.canvas.width = s.width = window.innerWidth;
    s.canvas.height = s.height = window.innerHeight;

    s.addShape(new Triangle(300, 200, 100, 0,'#ffbe0b'));
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

    s.addRay(new Ray(x, y, angle, 490, fill, '#ffffff'));
}
