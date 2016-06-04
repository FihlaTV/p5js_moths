/** Each lamp is a sphere.
 * It attracts moths when it is on.
 * The lamp has a random on and off cycle
 */
function Lamp(x, y) {
  // Each lamp has a location
  this.pos = createVector(x, y);
  // It has a duty cycle of 10 to 20 seconds on and 10 to 20 seconds off
  var period = 10 * 60;
  var start = period + random(period);
  var end = start + period + random(period);
  this.dutyCycle = createVector(start, end);
  this.cycleTime = this.dutyCycle.x + this.dutyCycle.y;
  // Count records the position in the duty cycle
  this.count = 10 * 60;

  this.draw = function() {
    if (this.lit()) { // If lit use white outline and yellow fill
      stroke(255);
      fill(255, 255, 10);
    } else { // If not lit use grey outline and dark grey fill
      stroke(120, 120, 120)
      fill(80, 80, 80);
    }
    // draw the actual light. 
    ellipse(this.pos.x, this.pos.y, 20, 20);
    // step the duty cycle counter
    this.count++;
  }
  
  /** @return true if the lamp is currently lit
   */
  this.lit = function() {
    var phase = this.count % this.cycleTime;
    return (phase > this.dutyCycle.x);
  }
}