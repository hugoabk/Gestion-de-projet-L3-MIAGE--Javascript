var SPRITESHEET_URL = "https://i.imgur.com/ZigaC0W.jpg";
var SPRITE_WIDTH = 78;
var SPRITE_HEIGHT = 90;


var canvas, ctx;
var spritesheet;
var ennemiGauche;
var stringsprite;

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // load the spritesheet
    spritesheet = new Image();
    spritesheet.src = SPRITESHEET_URL;

    // Called when the spritesheet has been loaded
    spritesheet.onload = function() {

      // Resize small canvas to the size of the spritesheet image
      canvas.width = SPRITE_WIDTH;
      canvas.height = SPRITE_HEIGHT;

      // get the sprite array
      stringsprite = "explosion";
      ennemiGauche = new Sprite(stringsprite);

      ennemiGauche.extractSprites(spritesheet, 26, 30);
      ennemiGauche.setNbImagesPerSecond(20);

      requestAnimationFrame(mainloop);
    }; // onload
};

function mainloop() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw sprite at 0, 0 in the small canvas
  ennemiGauche.draw(ctx, 0, 0, 1);

  requestAnimationFrame(mainloop);
}

// ------------------------
// Sprite utility functions
// ------------------------
function SpriteImage(img, x, y, width, height) {
   this.img = img;  // the whole image that contains all sprites
   this.x = x;      // x, y position of the sprite image in the whole image
   this.y = y;
   this.width = width;   // width and height of the sprite image
   this.height = height;
   // xPos and yPos = position where the sprite should be drawn,
   // scale = rescaling factor between 0 and 1
   this.draw = function(ctx, xPos, yPos, scale) {
      ctx.drawImage(this.img,
                    this.x, this.y, // x, y, width and height of img to extract
                    this.width, this.height,
                    xPos, yPos,     // x, y, width and height of img to draw
                    this.width*scale, this.height*scale);
   };
}

function Sprite(stringsprite) {
  this.spriteArray = [];
  this.currentFrame = 0;
  this.delayBetweenFrames = 10;

  this.extractSprites = function(spritesheet, spriteWidth, spriteHeight) {

    switch (stringsprite) {

  case "gauche":
      var gauche = new SpriteImage(spritesheet, 24 , 0, spriteWidth, spriteHeight);
      var gauche2 = new SpriteImage(spritesheet, 47 , 0, spriteWidth, spriteHeight);
      var gauche3 = new SpriteImage(spritesheet, 180 , 0, spriteWidth, spriteHeight);

      this.spriteArray.push(gauche2);
      this.spriteArray.push(gauche2);
      this.spriteArray.push(gauche2);
      this.spriteArray.push(gauche2);
      this.spriteArray.push(gauche3);
      this.spriteArray.push(gauche3);
      this.spriteArray.push(gauche3);
      this.spriteArray.push(gauche3);

      break;

  case "tir":

        var tir1 = new SpriteImage(spritesheet, 60 , 78, 18, spriteHeight);
        var tir2 = new SpriteImage(spritesheet, 185 , 78, 18, spriteHeight);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir2);
        this.spriteArray.push(tir2);
        break;

  case "explosion":

        var explosion1 = new SpriteImage(spritesheet, 111 , 150, 25, spriteHeight);
        var explosion2 = new SpriteImage(spritesheet, 138 , 150, 25, spriteHeight);
        var explosion3 = new SpriteImage(spritesheet, 168 , 150, 25, spriteHeight);
        var explosion4 = new SpriteImage(spritesheet, 201 , 150, 25, spriteHeight);
        this.spriteArray.push(explosion1);
        this.spriteArray.push(explosion1);
        this.spriteArray.push(explosion1);
        this.spriteArray.push(explosion2);
        this.spriteArray.push(explosion2);
        this.spriteArray.push(explosion2);
        this.spriteArray.push(explosion3);
        this.spriteArray.push(explosion3);
        this.spriteArray.push(explosion3);
        this.spriteArray.push(explosion4);
        this.spriteArray.push(explosion4);
        this.spriteArray.push(explosion4);
        break;

    break;
  default:
    console.log("ERREUR");
}



  }

  this.then = performance.now();
  this.totalTimeSinceLastRedraw = 0;

  this.draw = function(ctx, x, y) {
    // Use time based animation to draw only a few images per second
    var now = performance.now();
    var delta = now - this.then;

    // draw currentSpriteImage
    var currentSpriteImage = this.spriteArray[this.currentFrame];
    // x, y, scale. 1 = size unchanged
    currentSpriteImage.draw(ctx, x, y, 3);

    // if the delay between images is elapsed, go to the next one
    if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
       // Go to the next sprite image
      this.currentFrame++;
      this.currentFrame %=  this.spriteArray.length;

      // reset the total time since last image has been drawn
      this.totalTimeSinceLastRedraw = 0;
    } else {
      // sum the total time since last redraw
     this. totalTimeSinceLastRedraw += delta;
    }

    this.then = now;
  };

  this.setNbImagesPerSecond = function(nb) {
    // elay in ms between images
    this.delayBetweenFrames = 1000 / nb;
  };
}
