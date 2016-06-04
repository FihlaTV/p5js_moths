/** A moth has these properties
 * 1) The moth will randomly wander all the time.
 * 2) If one light is on it will steer towards that light. It will overcome the random movement.
 * 3) If more than one light is on it will steer towards the nearest light
 * 4) If it gets too close to a light it will get a kick in velocity away from the light
 * 5) Moths react to the wind, but it is too subtle to notice
 */
function Moth(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, -0.06);
  this.acc = createVector(0, 0);
  this.xoff = random(1000);
  this.xincrement = 0.01;
  this.maxSpeed = 0.05 + random(0.05); // Some moths fly faster

  this.draw = function() {
    stroke(255, 0, 0);
    strokeWeight(2);
    var x = this.pos.x;
    var y = this.pos.y;
    // Set the moth heading
    var angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle + PI / 2);
    // Draw the moth shape
    triangle(-1, -1, 0, -3, -5, +2);
    triangle(+1, -1, 0, -3, +5, +2);
    pop();
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  /** Seek the closest lamp that is lit
   */
  this.seek = function(lamps) {
    fill(255);
    // text("hello", 10, 60);
    // 
    var desired = false;
    var nearest; //  = createVector(0, 0);
    var mag;
    // Limited ability to perceive environment. Can only see the nearest lamp.
    for (var i = 0; i < lamps.length; i++) {
      var distance = p5.Vector.sub(lamps[i].pos, this.pos);
      if (lamps[i].lit()) {
        if (!desired) {
          desired = distance;
          nearest = lamps[i].pos;
        } else {
          if (distance.magSq() < mag) {
            desired = distance;
            nearest = lamps[i].pos;
          }
        }
        mag = desired.magSq();
      }
    }
    noStroke();
    // If no lights are lit then seek is not possible
    if (desired == false) {
      return; // No desired action
    } else {
      stroke(255, 255, 255, 40);
      if (toggleLines)
        line(this.pos.x, this.pos.y, nearest.x, nearest.y);
      fill(255);
    }
    // We now have the location of the nearest light
    var steering = desired.copy().sub(this.vel); // Reynolds seek
    // When a moth gets too close to the light, it gets pushed out
    if (steering.mag() < 10) {
      this.vel.setMag(this.maxSpeed * steering.mag() / 10);
      steering.rotate(PI / 20); // Avoid the centre
    } else
      steering.setMag(this.maxSpeed);
    this.applyForce(steering);
  }

  /** Randomise the direction with a weak pattern that will be overridden if a lamp is on.
   * Add this force and do physics engine stuff.
   * The seek force should already have been applied
   */
  this.update = function() {
    // internal "force" adding randomising where the moth flies
    var n = noise(this.xoff) * 2 * PI;
    this.xoff += this.xincrement;
    var c = createVector(0.01, 0);
    c.rotate(n);
    this.applyForce(c);
    // Physics engine
    this.vel.add(this.acc);
    this.vel.mult(0.99);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    // Stop the moths from getting lost
    this.wrap();
  }

  /** Moth halts if it touches the bottom
   */
  this.wrap = function() {
    // left wrap
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    // right wrap
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    // Bottom halt
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.set(0, 0);
    }
  }

}