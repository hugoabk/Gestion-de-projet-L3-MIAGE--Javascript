
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
    this.delayBetweenFrames = 1000/6;

    this.extractSprites = function(spritesheet) {
      switch (stringsprite) {

        case "left":
        // position de base pas implémenté
        var left = new SpriteImage(spritesheet, 280 , 135, 45, 55);


        var left2 = new SpriteImage(spritesheet, 97 , 134, 45, 55);
        var left3 = new SpriteImage(spritesheet, 145 , 68, 45, 55);
        var left4 = new SpriteImage(spritesheet, 97 , 4, 45, 55);


        this.spriteArray.push(left2);
        this.spriteArray.push(left3);
        this.spriteArray.push(left4);
        this.spriteArray.push(left3);
        this.spriteArray.push(left2);


        break;

        case "tir":

        var tir1 = new SpriteImage(spritesheet, 234 , 134, 45, 55);
        var tir2 = new SpriteImage(spritesheet, 468 , 134, 45, 55);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir1);
        this.spriteArray.push(tir2);
        this.spriteArray.push(tir2);
        break;

        case "explosion":

        var explosion1 = new SpriteImage(spritesheet, 280 , 313, 45, 55);
        var explosion2 = new SpriteImage(spritesheet, 330 , 315, 45, 55);
        var explosion3 = new SpriteImage(spritesheet, 390 , 312, 45, 55);
        var explosion4 = new SpriteImage(spritesheet, 450 , 312, 45, 55);
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


        // marche uniquement avec la deuxième image
        case "right":

        var right2 = new SpriteImage(spritesheet, 492 , 134, 45, 55);
        var right3 = new SpriteImage(spritesheet, 442 , 68, 45, 55);
        var right4 = new SpriteImage(spritesheet, 492 , 4, 45, 55);


        this.spriteArray.push(right2);
        this.spriteArray.push(right3);
        this.spriteArray.push(right4);
        this.spriteArray.push(right3);
        this.spriteArray.push(right2);
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
