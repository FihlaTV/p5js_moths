/** A blade of grass that moves with the wind
 */
function Grass(x, y) {
  // Each blade of crass has a location
  this.x = x;
  this.y = y;
  
  /** @param wind to make the grass rustle
   */
  this.draw = function(wind) {
    // Make the grass green, width 2
    strokeWeight(2);
    stroke(30, 99, 0);
    // Scale the wind to suit. Add randomness so they don't move exactly the same
    var windScale = wind.x*random(1);
    var sc = 500;
    windScale=windScale*sc;
    // draw the blade
    line(this.x, this.y, this.x + windScale, this.y - 20);
  }
}