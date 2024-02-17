// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    const mx = parseInt(e.clientX - offsetX);
    const my = parseInt(e.clientY - offsetY);

    // test each shape to see if mouse is inside
    dragok = false;
    for (let i = 0; i < shapes.length; i++) {
        var s = shapes[i];
        // decide if the shape is a rect or circle
        if (s.width) {
            // test if the mouse is inside this rect
            if (
                !dragok &&
                mx > s.x &&
                mx < s.x + s.width &&
                my > s.y &&
                my < s.y + s.height
            ) {
                // if yes, set that rects isDragging=true
                dragok = true;
                s.isDragging = true;
            }
        } else {
            const dx = s.x - mx;
            const dy = s.y - my;
            // test if the mouse is inside this circle
            if (!dragok && dx * dx + dy * dy < s.r * s.r) {
                dragok = true;
                s.isDragging = true;
            }
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}

// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].isDragging = false;
    }
}

// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        const mx = parseInt(e.clientX - offsetX);
        const my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        const dx = mx - startX;
        const dy = my - startY;

        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (let i = 0; i < shapes.length; i++) {
            const s = shapes[i];
            if (s.isDragging) {
                s.x += dx;
                s.y += dy;

                //set the boundaries for the shapes
                if (s.x < 0) s.x = 0;
                if (s.y < 0) s.y = 0;
                if (s.x + s.width > WIDTH) s.x = WIDTH - s.width;
                if (s.y + s.height > HEIGHT) s.y = HEIGHT - s.height;
            }
        }

        // redraw the scene with the new rect positions
        redraw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }

    //save the mouse position
    user.mouseX = e.clientX;
    user.mouseY = e.clientY;
}

function myRotate() {
    //get the mouse position without the e
    const mx = parseInt(user.mouseX - offsetX);
    const my = parseInt(user.mouseY - offsetY);

    //get the scroll change from y = 5000
    let scrollChange = (window.scrollY - 5000) / 20;

    window.scrollTo(0, 5000);

    for (let i = 0; i < shapes.length; i++) {
        var s = shapes[i];
        // decide if the shape is a rect or circle
        if (s.width) {
            // test if the mouse is inside this rect
            if (
                mx > s.x &&
                mx < s.x + s.width &&
                my > s.y &&
                my < s.y + s.height
            ) {
                // if yes, set that rects isDragging=true
                s.rotation += scrollChange;
            }
        }
    }

    redraw();
}