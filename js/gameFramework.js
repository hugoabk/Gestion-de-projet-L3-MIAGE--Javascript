// Target Object
class Target {

  constructor(id,x, y, w, h,vx,vy, couleur) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.couleur = couleur;
  }

  draw(ctx) {
    ctx.fillStyle = this.couleur;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

}

// Take Cover Object
class TakeCover {

  constructor(w,h) {
    this.x = 0;
    this.y = h;
    this.w = w;
    this.h = h;
    this.vy = 20;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  moveToTheTop(h) {
    if(this.y > h*0.25){
      this.y -= this.vy;
    }
    else
    {
      this.y = h*0.25;
    }
  }

  moveToTheBottom(h){
    if(this.y < h){
      this.y += this.vy;
    }
    else
    {
      this.y = h;
    }
  }
}



// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};


// GAME FRAMEWORK STARTS HERE
var GF = function(){
    // Vars relative to the canvas
    var canvas, ctx, w, h;

    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;

    // vars for handling inputs
    var inputStates = {};

    // vars for handling targets
    var id = 0;
    var targets = [];

    // var for handling cover
    var takeCover;


    var measureFPS = function(newTime){

         // test for the very first invocation
         if(lastTime === undefined) {
           lastTime = newTime;
           return;
         }

        //calculate the difference between last & current frame
        var diffTime = newTime - lastTime;

        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }

       frameCount++;
    };

    // display FPS
    function displayFPS(){
      if(fps !== undefined)
      {
      ctx.save();
      ctx.font = "10px sans-serif";
      ctx.fillText("FPS : " + fps,0,10);
      ctx.restore();
      }
    }

     // clears the canvas content
     function clearCanvas() {
       ctx.clearRect(0, 0, w, h);
     }


     // TARGETS
     // create targets
     function createTargets(n) {

       for(let i = 0; i < n; i++) {
         let x = Math.random() * w;
         let y  = Math.random() * h -100;
         let vx = 0.5;
         let vy = 0;
         let c = "green";

         let target = new Target(id,x, y, 100, 100, vx, vy, c);

         targets.push(target);

         id++;
       }
     }

    // draw targets
    function drawTarget() {
      targets.forEach((t) => {
        t.draw(ctx);
      })
    }
    // collision check for the targets
    function targetsCollision() {
      targets.forEach((t) => {
        if(((t.x+t.w) > w)) {
        t.vx = -t.vx;
        t.x  = w - t.w;
        }

        if(t.x < 0) {
        t.vx = -t.vx;
        t.x = 0
        }
      });
    }

    // update the targets state
    function targetsUpdate(){
      if(inputStates.mousedown === true && inputStates.mouseButton === 0 ){
        targets.forEach((t) => {
          if(inputStates.mousePos.x > t.x && inputStates.mousePos.x < t.x + t.w
          && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h){
            targets = targets.filter((target) => target.id !== t.id);
            }
        })
      }
      targets.forEach((t) => {
        t.move(ctx);
      })
      targetsCollision();
    }

    // TAKE COVER
    function drawTakeCover(){
      takeCover.draw(ctx);
    }

    // update the cover state
    function takeCoverUpdate(){
      if(inputStates.ctrl === true){
        takeCover.moveToTheTop(h);
      }
      else if(inputStates.ctrl === false) {
        takeCover.moveToTheBottom(h);
      }
    }

    // MAIN LOOP

    var mainLoop = function(time){
        // measure the frames per second
        measureFPS(time);

        // clear the canvas
        clearCanvas();

        // display the fps on the top-left corner
        displayFPS();

        // draw the targets
        drawTarget();

        // take cover
        drawTakeCover();

        // draw the weapon sight
        drawSight();

        // Check inputs and update the game state
        updateGameState();

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    // Update the game components
    function updateGameState(){
      targetsUpdate();
      takeCoverUpdate();
    }

    // Draw the weapon sight is the mouse position is in the canvas
    function drawSight(){
      if(inputStates.mousePos != undefined){
      let x = inputStates.mousePos.x;
      let y = inputStates.mousePos.y;

      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(x-20,y);
      ctx.lineTo(x-5,y);
      ctx.moveTo(x+20,y);
      ctx.lineTo(x+5,y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x,y-20);
      ctx.lineTo(x,y-5);
      ctx.moveTo(x,y+20);
      ctx.lineTo(x,y+5);
      ctx.stroke();
      ctx.restore();
      }
    }

    function getMousePos(event) {
      var rect = canvas.getBoundingClientRect();
      // If the mouse position is in the canvas then it returns the position
      if(event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom){
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      // Else it just returns undefined
      }else{
        return {
          x: undefined,
          y: undefined
        }
      }
    }

    var start = function(){
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

        canvas = document.querySelector("#myCanvas");
        canvas.style.cursor="none";

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext('2d');

        ctx.font="20px Arial";


      // Add the listeners for the recharging key and the take cover key

      window.addEventListener('keydown', function(event){
          if (event.keyCode === 17) {
             inputStates.ctrl = true;
          } else if (event.keyCode === 82) {
             inputStates.r = true;
          }},
          false);


      window.addEventListener('keyup', function(event){
          if (event.keyCode === 17) {
             inputStates.ctrl = false;
          } else if (event.keyCode === 82) {
             inputStates.r = false;
          }},
           false);

      // Add the listeners for the mouse moves et the mouse clicks
      window.addEventListener('mousemove', function (evt) {
          inputStates.mousePos = getMousePos(evt);
      }, false);

      canvas.addEventListener('mousedown', function (evt) {
            inputStates.mousedown = true;
            inputStates.mouseButton = event.button;
      }, false);

      canvas.addEventListener('mouseup', function (evt) {
          inputStates.mousedown = false;
      }, false);

      createTargets(2);
      takeCover = new TakeCover(w,h);

      requestAnimationFrame(mainLoop);
    };


    return {
        start: start
    };
};
