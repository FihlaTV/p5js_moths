var xw; // scale everything according to this so we can resize for different displays
var yh;
var xc;
var yc;
var img;
var fg;
var target;
var current;
var logoScale;
var secondWidth; // Width of the second hand is the same as the numeral gap
var lastSecond;
var theta=0;
var wibble=0;
function preload() {
  img=loadImage("image/bbc2.jpg");
}

function setup() {
  var sc=1; // 2.4; // Set to 1 for full scale
  xw=displayWidth/sc;
  yh=displayHeight/sc;
  createCanvas(xw,yh);
  xc=xw/2-xw/16;
  yc=yh/2-yh/8;
  fg=color(57,157,206);
  //fg=color(255,255,0);
  secondWidth=xw/200;
	// scale of logo based on 600x450 original image 
	logoScale=yh/450;
	// While the logo itself is 266 x 65
	img.resize(266*logoScale,65*logoScale);
}

function draw() {
  push();
  background(4,1,132);
  image(img,xc-(266*logoScale)/2,yh*0.70); // magic constant. BBC 2 logo is fixed size 266 wide :-(

  noFill();
  stroke(fg);
  centreRing();
  numerals();
  hourHand();
  minuteHand();
  secondHand();
  pop();
	//stroke(color(255,0,0));
	//fill(255);
	//text(logoScale,10,100);
}

function secondHand()
{
  push();
  fill(fg);
  noStroke();
  translate(xc,yc);
  target=PI+2*PI*second()/60;
  if (lastSecond!=second())
    wibble=0.01;
  wibble=wibble*0.9;
  theta+=0.8;
  rotate(target+wibble*sin(theta));
  translate(0,xw/19/2);
  rect(-secondWidth/2,0,secondWidth,xw/6.5);
  pop();
  noStroke();
  fill(255);
  lastSecond=second();
}

function hourHand()
{
  push();
  fill(fg);
  noStroke();
  translate(xc,yc);
  var hr=hour()*60+minute();
  var angle=PI+2*PI*(hr)/720;
  rotate(angle);
  translate(0,xw/19/2);
  var wide=xw/100;
  rect(-wide/2,0,wide,xw/9.9);
  pop();
  stroke(color(255,255,0));
}

function minuteHand()
{
  push();
  fill(fg);
  noStroke();
  translate(xc,yc);
  rotate(PI+2*PI*(minute()*60+second())/3600);
  translate(0,xw/19/2);
  var wide=xw/100;
  rect(-wide/2,0,wide,xw/6.5);
  pop();
}

function centreRing()
{
  strokeWeight(xw/120);
  var r=xw/19;
  ellipse(xc,yc,r,r);
}

function numerals()
{
  fill(fg);
  noStroke();
  push();
  translate(xc,yc);

  for (var i=0;i<12;i++)
  {
    push();
    rotate((i+7)*PI/6);
   // translate(-xc,-yc);
    translate(0,xw/7.7); // The radius offset of the numeral from the centre
    var hgt=xw/22; // height of numeral
    var barwidth=lerp(xw/220,xw/80,i/12);
    // var gap=lerp(xw/190,xw/110,i/12);
    rect(-barwidth-secondWidth/2,0,barwidth,hgt);
    rect(secondWidth/2,0,barwidth,hgt);
    pop();
  }
  pop();
}
