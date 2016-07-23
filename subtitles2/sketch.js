  //metrics
var gTtxW;
var gTtxH;
var gTtxFontSize = 20;

var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
  myRec.continuous = true; // do continuous recognition
  myRec.interimResults = true; // don't allow partial recognition (slower, more accurate)
  var yv;
  var mystr = [];
  var onAir;
  var capture;

  function preload() {
    //  ttxFont = loadFont("assets/teletext2.ttf"); // Normal  
    ttxFontDH = loadFont("assets/teletext4.ttf"); // Double height 
  }

  function setup() {
    yv = 20;
    mystr.push(".");
    mystr.push(".");
    // graphics stuff:
    createCanvas(800, 600);
    myRec.onResult = parseResult; // recognition callback
    myRec.start(); // start engine


    myRec.onEnd = onEndEvent;
    myRec.onStart = onStartEvent;
    myRec.onError = onErrorEvent;
    onAir = true;
  capture = createCapture(VIDEO);
  capture.size(800, 600);  
  capture.hide();
  // text stuff
    textFont(ttxFontDH);
    textSize(gTtxFontSize); 
    gTtxW = textWidth(String.fromCharCode(0xe6df))*2;
    gTtxH = gTtxFontSize;    
  
  }

  function draw() {
    if (onAir)
      background(150, 10, 0);
    else
      background(100, 100, 100);
    image(capture, 0, 0, 800, 600);
    fill(255);
    drawText(mystr);
  }

  function splitLines(str) {
    var s1 = split(str, ' ');
    var result = [];
    var row='';
    var len = 0;
    for (var i = 0; i < s1.length; i++) {
      len += s1[i].length;
      if (len < 32) {
        row += s1[i] + ' ';
      } else {
        result.push(row);
        row = s1[i]+' ';
        len = 0;
      }

    }
    if (len>0) result.push(row);
    return result;
  }

  function drawText(mystr) {
    var str1;
    var str2 = "no data yet";
    if (mystr.length<2){
      return;
    }
    // Split into lines of 32 with 4 gap either side.
    var sp = splitLines(mystr[0]+mystr[1]);

    fill(255, 255, 255);
    textSize(32);
    
    var offset=sp.length-2;
    if (offset<0) offset=0;
    if (sp.length>0)
    drawRow(sp[offset], 4, 20);
    if (sp.length>1)
    drawRow(sp[offset+1], 4, 22);
  }

  function drawRow(txt,xloc,row) {
    drawChar = function(ch, x, y) {
        text(ch, x * gTtxW, (y + 1) * gTtxH);
      } // drawChar    
    var fg=color(255);
    for (var xp = 0; xp<txt.length; xp++) {  
      fill(0);
      stroke(0);
      strokeWeight(6);
      var ch = txt.charAt(xp);
      if (ch.charCodeAt(0)<8) {
        switch(ch.charCodeAt(0)) {
        case 0:fg=color(0,0,0);break;
        case 1:fg=color(255,0,0);break;
        case 2:fg=color(0,255,0);break;
        case 3:fg=color(255,255,0);break;
        case 4:fg=color(0,0,255);break;
        case 5:fg=color(0,255,255);break;
        case 6:fg=color(255,0,255);break;
        case 7:fg=color(255,255,255);break;
        }
        ch=' ';
      }
      drawChar(String.fromCharCode(0xe6df), xloc+xp, row);      
      noStroke();
      fill(fg);
      drawChar(ch,xloc+xp,row);
    }
  }

  function onStartEvent() {
    console.log("START");
    onAir = true;
  }

  function onEndEvent() {
    console.log("END");
    onAir = false;
  }

  function onErrorEvent() {
    console.log("ERROR");
  }

  function mouseClicked() {
    myRec.start(); // start engine
    onAir = true;
  }

  function parseResult() {
    var flag = '';
    if (myRec.resultConfidence > 0.5) flag = '*';
    //console.log(myRec.resultString + ' ' + flag);

    var interim_transcript = '';
    var final_transcript = '';

    var event = myRec.resultJSON;
    if (event == "undefined") return;
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    //final_transcript = capitalize(final_transcript);
    //final_span.innerHTML = linebreak(final_transcript);
    //interim_span.innerHTML = linebreak(interim_transcript);
    mystr[0] = final_transcript+String.fromCharCode(0x03);
    mystr[1] = interim_transcript;
    //console.log("[onresult]" + final_transcript);
  }