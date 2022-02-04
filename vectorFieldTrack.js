// array for storing vectors
locs = [];

/**
 * Setting up the P5 sketch.
 * Canvas dimensions are set, test size is set, and a matrix of vectors is set up for drawing the vector field with random deviance from the x,y grid.
 * Sliders for adjusting curl and the ring-fade are also instantiated.
 */
function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // resolution of vector field, one vector for every 50 pixels
    res = 50;
    xCount = ceil(width / res);
    yCount = ceil(height / res);

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every <res> pixels across x-axis
    // x and y are randomly deviated from the grid [0, 10] pixels
    for (let i = 0; i <= yCount; i++) {
        for (let j = 0; j <= xCount; j++) {
            locs.push(new p5.Vector(res * j + Math.random() * 50, res * i + Math.random() * 50));
        }
    }
}

// Initial (x, y) pos of circle
circleX = 400;
circleY = 400;

speedX = 0;
speedY = 0;

lastSpeedX = 0;
lastSpeedY = 0;

/**
 * Rendering components to the canvas.
 * Variables for curl and ring-fade are initiated.
 * Noise for movement along the xy-plane is developed.
 * 
 * A matrix of position vectors for the track of the moving object is built and drawn.
 * A circle is drawn to be tracked around the canvas.
 * 
 * Vectors are drawn across the grid with color, width, and magnitude varying based on distance from the tracked object.
 * Vector curl and draw-distance is adjusted live with the sliders.
 */
function draw() {

    if (mouseIsPressed) {

        // Determining x, y movement speed of object based on relative distance from mouse
        speedX = 25 * abs(circleX - mouseX) / maxDist();
        speedY = 25 * abs(circleY - mouseY) / maxDist();

        // Changing x-axis direction and speed based on mouse distance
        if (circleX - mouseX > 20) {
            circleX -= speedX;
        } else if (circleX - mouseX < 20) {
            circleX += speedX;
        }

        // Change y-axis direction and speed based on mouse distance
        if (circleY - mouseY > 20) {
            circleY -= speedY;
        } else if (circleY - mouseY < 20) {
            circleY += speedY;
        }

    } else {

        if (circleX < windowWidth) {
            circleX += speedX;
        } else {
            circleX -= speedX
        }

        if (circleY < windowHeight) {
            circleY += speedY;
        } else {
            circleY -= speedY
        }

    }

    // setting background color to turquiose ish
    background(200);

    // building object to track
    fill(100);
    noStroke();
    circle(circleX, circleY, 20);

    // removing fill and setting line stroke
    noFill();
    stroke(0);

    // iterating through each vector in locs
    for (let k = 0; k < locs.length; k++) {

        // builds a new vector based off relative location of the mouse pointer
        /**
         * <P> = <x, y>         position vector from locs
         * <M> = <a, b>         position vector of mouse
         * To get new vector pointing towards mouse from <P>, 
         * we build a new vector as:
         * <H> = <-x + a, -y + b>
         * 
         * This is necessary because the origin is in the top left of the screen
         * so we must create a new position vector that points towards to true
         * location of the mouse.
         */
        let h = new p5.Vector(-locs[k].x + circleX, -locs[k].y + circleY);

        // creates an instance specific to the new vector h
        push();

        // translate the next object to the head of the pos vector in locs
        translate(locs[k].x, locs[k].y);

        // rotates the next object in this instance to the heading of vector h
        rotate(h.heading());

        // color of the line is dependent on distance from circle
        // given as a ratio of max distance to current distance
        let rat = 0.1 + (dist(locs[k].x, locs[k].y, circleX, circleY)) / (maxDist());
        let from = color(200, 0, 230);
        let to = color(200);
        let magnitude = lerpColor(from, to, rat);
        stroke(magnitude);
        strokeWeight(6 - (6 * (rat)));

        /* creates a line object at the origin pointing directly right
         * translate and rotate are applied to this line
         * translate moves the base of the line to vector from locs
         * rotate turns the vector based on vector h heading
         * 
         * To create curl, all we need to do is change the ratio of x2 and y2.
         * The heading of the line is based on vector h and the rotate()
         * function will just add n-radians. Keeping y2 as 0 makes the vector point directly
         * towards the mouse.
         */
        line(0, 0, 15, 0);

        // exit the instance
        pop();

    }

}

/**
 * Function that returns the max diagonal distance of the frame
 */
function maxDist() {

    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);

}