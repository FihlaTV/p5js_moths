// Objects on screen
var fents = [];
var grass = [];
var lamps = [];
var moths = [];

// perlin noise for wind direction
var xoff;
var xincrement;

// Properties
var wind;
var time;

// light position
var lightXC;
var lightYC;
var lightD1;
var lightD2;

// Desired direction lines visible
var toggleLines=false;

// Set to the screen and all the objects that will appear
function setup() {
  createCanvas(800, 300);
  time=0;
  // Set up the Perlin noise used for the wind
  xoff = random(9999);
  xincrement = 0.009;
  
  // Make a fence by replicating a fent.
  for (var i = 0; i < 20; i++) {
    fents.push(new Fent(i, height * 0.8, width / 20));
  }
  
  // Add lots of grass
  for (var i = 0; i < 400; i++) {
    grass.push(new Grass(random(width), height * (0.9 + random(0.1))))
  }

  // Not a hyperbolic cosine arc but an ellipse for the light string
  lightXC = width / 2;
  lightYC = height * 0.0;
  lightD1 = width * 1.5;
  lightD2 = height / 1.5;
  // Lights that follow the lighht string arc
  for (var i = 0; i < 4; i++) {
    var angle = i * radians(24) + radians(-38);
    var xc = lightXC + lightD1 / 2 * sin(angle);
    var yc = lightD2 / 2 * cos(angle) + 10;
    lamps.push(new Lamp(xc, yc));
  }
  // Ten "moths" that roam around
  for (var i = 0; i < 10; i++) {
    moths.push(new Moth(random(width), random(height)));
  }
}

/** Draw the scene 
 */
function draw() {
  // static elements
  background(0, 0, 80);
  fill(255,255,255,255-((time/3)>255?255:(time++/3)));
  noStroke();
  text("Click the mouse to toggle target lines",10,10);
  fence();
  lighting();
  // moving elements
  attraction();
  lawn(getWind());
  moth();
}

/** Each call to wind increments the Perlin noise
 */
function getWind() {
  xoff += xincrement / 10;
  var windex = (noise(xoff) - 0.5) * 0.009 + 0.003;
  wind = createVector(windex, 0); // Perlin noise seems to bias to the left so this compensates
  return wind;
}


/** The nearest lamp that is lit attracts moths.
 */
function attraction() {
  for (m = 0; m < moths.length; m++) {
    moths[m].seek(lamps);
  }
}

/** Draw all of the moths by
 * applying forces, updating then drawing them
 */
function moth() {
  for (var i = 0; i < moths.length; i++) {
    moths[i].applyForce(wind);
    moths[i].update();
    moths[i].draw();
  }
}

/** Draw light bulbs suspended by a wire.
 */
function lighting() {
  //  Ellipse is an approximation to a catenary.
  stroke(40, 50, 60);
  strokeWeight(2);
  noFill();
  ellipse(lightXC, lightYC, lightD1, lightD2);
  // Draw each of the lamps
  for (var i = 0; i < lamps.length; i++) {
    lamps[i].draw();
  }
}

/** A fence is made from from two horizontal
 */
function fence() {
  stroke(200.130, 0);
  strokeWeight(2);
  fill(255, 100, 0);
  rect(0, height * 0.55, width, 10); // Horizontal rails
  rect(0, height * 0.70, width, 10);
  for (var i = 0; i < fents.length; i++) { // Row of fents.
    fents[i].draw();
  }
}

/** Lawn is a collection of blades of grass
 */
function lawn(wind) {
  for (var i = 0; i < grass.length; i++) {
    grass[i].draw(getWind());
  }
}

/** When the mouse is pressed switch the desire (vehicle to target) lines on and off
 */
function mousePressed() {
  toggleLines=!toggleLines;
}