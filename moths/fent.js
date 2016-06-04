/** A fent is a single vertical post
 */
var Fent = function(i,y,spacing) {
  // A fent has a location
  this.x=i*spacing;
  this.y=y;
  this.draw=function()
  {
    var x=this.x;
    var y=this.y;
    // Each fent is 90 units high
    var h=90;
    stroke(0); // Black outline. The fill colour is inherited from the rails drawn immediately before 
    beginShape();
    vertex(x,y);  // bottom left corner
    vertex(x,y-h); // top left 
    vertex(x+5,y-h-5); // apex
    vertex(x+10,y-h); // top right
    vertex(x+10,y); // bottom right
    endShape(CLOSE);
  }
}