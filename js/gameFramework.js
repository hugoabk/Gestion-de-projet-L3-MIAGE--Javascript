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
    var fps;
    var score;
    var val_score;

    // vars for handling inputs
    var inputStates = {};

    // vars for handling targets
    var id = 0;
    var targets = [];

    // var for handling cover
    var takeCover;

    // var for click
    var boolClick= 1;

    // var for ammunitions
    var magazine;
    var reloading;
    var isReloading = false;
    var idReload;

    //var for assets
    var assets;

    // vars for backgrounds
    var forest;
    var city;
    var idBackground;
    var backgroundsAreMoving = false;


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
      ctx.fillText("FPS : " + fps,w-40,10);
      ctx.restore();
      }
    }

    function addScore(inc) {
      var new_val = Number(val_score);
      new_val += inc;
      val_score = new_val.toString();
    }

    // display Score
    function displayScore(){
      if(val_score !== undefined) {
        score = new Score("Score : " + val_score,5,80);
        score.draw(ctx);
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
         let y  = h-200;
         let vx = 0.5;
         let vy = 0;
         let c = "black";
         let pdv = 10;
         let target = new Target(id,x, y, vx, pdv, "right");
         target.extractSprites(assets.spriteSheetRight);

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
        t.sprite = new Sprite("left");
        t.extractSprites(assets.spriteSheetLeft);
       }

        if(t.x < 0) {
        t.vx = -t.vx;
        t.x = 0
        t.sprite = new Sprite("right");
        t.extractSprites(assets.spriteSheetRight);
        }
      });
    }
    function checkForReload(){
      if(inputStates.r === true){
        if(magazine.capacity<magazine.capacityMax){
          reloading = true;
        }
        else
        {
          // if capacity already full
        }
      }

      if(magazine.capacity<magazine.capacityMax && reloading === true){
        if(isReloading === false){
          assets.reloadSound.play();
          idReload = setInterval(reload,500);
          isReloading = true;
        }
      }
      else
      {
        clearInterval(idReload);
        isReloading = false;
        reloading = false;
        assets.reloadSound.stop();
      }
    }

    function reload(){
        magazine.capacity += 1;
     }
    // update the targets and magazine state
    function targetsAndMagazineUpdate(){
      if(inputStates.mousedown === true && inputStates.mouseButton === 0 && boolClick === 1){
        boolClick = 0;
        if(magazine.capacity > 0 && reloading !== true){
          assets.gunShotSound.play();
          magazine.capacity -= 1;
          targets.forEach((t) => {
            if(inputStates.mousePos.x > t.x && inputStates.mousePos.x < t.x + t.w / 2
            && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h/2){
                t.pointDV -= 2;
                addScore(10);
            } else if(inputStates.mousePos.x >= t.x + t.w / 2  && inputStates.mousePos.x < t.x + t.w
            && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h/2){
                t.pointDV -= 3;
                addScore(25);
            } else if (inputStates.mousePos.x > t.x && inputStates.mousePos.x < t.x + t.w / 2
            && inputStates.mousePos.y > t.y + t.h / 2 && inputStates.mousePos.y < t.y + t.h){
                t.pointDV -= 4;
                addScore(50);
            } else if (inputStates.mousePos.x >= t.x + t.w / 2  && inputStates.mousePos.x < t.x + t.w
            && inputStates.mousePos.y >= t.y + t.h / 2 && inputStates.mousePos.y < t.y + t.h){
                t.pointDV -= 5;
                addScore(100);
            }
            if(t.pointDV<=0){
              let index = targets.findIndex(item => item.id === t.id);
              targets[index].sprite = new Sprite("explosion");
              targets[index].extractSprites(assets.spriteSheetLeft);
              setTimeout(()=>{targets = targets.filter((target) => target.id !== t.id);},100);
            }
        })
      }
      else
      {
        assets.emptyGunSound.play();
      }
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

    // draw background
    function drawBackground(){
      forest.draw(ctx,w,h);
      city.draw(ctx,w,h);
    }

    function moveBackgrounds(){
      if(city.x <= 0){
        forest.move();
        city.move();
      }
      else
      {
        clearInterval(idBackground);
        backgroundsAreMoving = false;
      }
    }

    // switch level
    function nextLevel(level){
      backgroundsAreMoving = true;
      if(level === 2){
      createTargets(3);
      idBackground = setInterval(moveBackgrounds,1000/60);
      }
    }
    // MAIN LOOP

    var mainLoop = function(time){

        // measure the frames per second
        measureFPS(time);

        // clear the canvas
        clearCanvas();
        // draw background
        drawBackground();

        if(backgroundsAreMoving === false){
          // display the fps on the top-left corner
          displayFPS();

          // display the score on the top-left corner
          displayScore();

          // draw Magazine
          drawMagazine();

          // draw the targets
          drawTarget();

          // take cover
          drawTakeCover();

          // draw the weapon sight
          drawSight();
        }
        else
        {
          ctx.save()

          ctx.fillStyle = "black";

          ctx.fillRect(0, 0, w, 50);
          ctx.fillRect(0, h - 50, w, 50);

          ctx.restore();
        }
        // Check inputs and update the game state
        updateGameState();

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    // Update the game components
    function updateGameState(){
      targetsAndMagazineUpdate();
      takeCoverUpdate();
      checkForReload();
      if(targets.length == 0 && backgroundsAreMoving == false){
        nextLevel(2);
      }
    }

    // MAGAZINE

    function drawMagazine(){
      magazine.draw(ctx);
    }

    // ASSETS

    function allAssetsLoaded(assetsLoaded){
        assets = assetsLoaded;
        forest = new Background(0,0,assets.firstBackground);
        city = new Background(-w,0, assets.secondBackground);
        createTargets(3);


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


        canvas = document.querySelector("#myCanvas");
        canvas.style.cursor="none";

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext('2d');

        ctx.font="20px Arial";


      // Add the listeners for the reloading key and the take cover key

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
          boolClick = 1;

      }, false);

      takeCover = new TakeCover(w,h);
      magazine = new Magazine(10);
      val_score = "0";

      loadAssets((assetsLoaded) => {
        allAssetsLoaded(assetsLoaded);
        requestAnimationFrame(mainLoop);
      })
    };


    return {
        start: start
    };
};
