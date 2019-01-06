// Inits
window.onload = function init() {
  var game = new GF();
  var sound = true;
  game.displayMenu();


};




// GAME FRAMEWORK STARTS HERE
var GF = function(){
    // Vars relative to the canvas
    var canvas, ctx, w, h;
    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fps;

    // vars for handling score and healthpoints
    var score;
    var val_score;
    var healthpoint = 100;

    // vars for handling parameters
    var isSoundOn = true;
    var sightColor = "green";

    // vars for handling inputs
    var inputStates = {};

    // vars for handling targets
    var id = 0;
    var targets = [];
    var targetsKilled = 0;

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

    // vars for levels
    var Levels = [];
    var currentLevel = 0;

    // vars for backgrounds
    var backgrounds = [];
    var currentBackground = 0;
    var idBackground;
    var backgroundsAreMoving = false;
    
    // var pause/resume game
    var isRunning = true;

    // var crates
    var crates = [];
    const floor = 250;
    var bulletHoles = [];
    var requestID;

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
      ctx.fillText("FPS : " + fps,w-50,15);

      ctx.restore();
      }
    }
  
    function displayMenu() {
      document.getElementById("myCanvasMenu").style.display = "block";
      document.getElementById("viseur").style.display = "block";
      document.getElementById("jouer").style.display = "block";
      document.getElementById("score").style.display = "block";
      document.getElementById("parametre").style.display = "block";

      var play = document.getElementById("jouer");
      play.onclick = function () {
        hideMenu();
        if(!isRunning){
          togglePause();
        }
        else
        {
        start();
        }
      };

      var parameter = document.getElementById("parametre");
      parameter.onclick = function () {
        document.getElementById("jouer").style.display = "none";
        document.getElementById("score").style.display = "none";
        document.getElementById("parametre").style.display = "none";
        if(isSoundOn){
          document.getElementById("speaker").style.display = "block";
        } 
        else
        {
          document.getElementById("mute").style.display = "block";
        }
        document.getElementById("sound").style.display = "block";
        document.getElementById("aim").style.display = "block";
        document.getElementById("back").style.display = "block";
        document.getElementById("yellowSight").style.display = "block";
        document.getElementById("redSight").style.display = "block";
        document.getElementById("greenSight").style.display = "block";
        switch(sightColor){
          case "green":
            document.getElementById("greenSquare").style.display = "block";
            break;
          case "red":
            document.getElementById("redSquare").style.display = "block";
            break;
          case "yellow":
            document.getElementById("yellowSquare").style.display = "block";
            break;
        }
      };

      var redSight = document.getElementById("redSight");
      redSight.onclick = function () {
        document.getElementById("greenSquare").style.display = "none";
        document.getElementById("yellowSquare").style.display = "none";
        document.getElementById("redSquare").style.display = "block";
        sightColor = "red";
      };

      var yellowSight = document.getElementById("yellowSight");
      yellowSight.onclick = function () {
        document.getElementById("greenSquare").style.display = "none";
        document.getElementById("redSquare").style.display = "none";
        document.getElementById("yellowSquare").style.display = "block";
        sightColor = "yellow";
      };

      var greenSight = document.getElementById("greenSight");
      greenSight.onclick = function () {
        document.getElementById("yellowSquare").style.display = "none";
        document.getElementById("redSquare").style.display = "none";
        document.getElementById("greenSquare").style.display = "block";
        sightColor = "green";
      };

      var speaker = document.getElementById("speaker");
      speaker.onclick = function () {
        document.getElementById("speaker").style.display = "none";
        document.getElementById("mute").style.display = "block";
        isSoundOn = false;
      };

      var mute = document.getElementById("mute");
      mute.onclick = function () {
        isSoundOn = true;
        document.getElementById("mute").style.display = "none";
        document.getElementById("speaker").style.display = "block";
      };


      var back = document.getElementById("back");
      back.onclick = function () {
        document.getElementById("jouer").style.display = "block";
        document.getElementById("score").style.display = "block";
        document.getElementById("parametre").style.display = "block";
        document.getElementById("sound").style.display = "none";
        document.getElementById("speaker").style.display = "none";
        document.getElementById("mute").style.display = "none";
        document.getElementById("aim").style.display = "none";
        document.getElementById("back").style.display = "none";
        document.getElementById("yellowSquare").style.display = "none";
        document.getElementById("redSquare").style.display = "none";
        document.getElementById("greenSquare").style.display = "none";
        document.getElementById("yellowSight").style.display = "none";
        document.getElementById("redSight").style.display = "none";
        document.getElementById("greenSight").style.display = "none";
      };

    }

    function hideMenu(){
      document.getElementById("myCanvasMenu").style.display = "none";
      document.getElementById("viseur").style.display = "none";
      document.getElementById("jouer").style.display = "none";
      document.getElementById("score").style.display = "none";
      document.getElementById("parametre").style.display = "none";
      document.getElementById("sound").style.display = "none";
      document.getElementById("speaker").style.display = "none";
      document.getElementById("mute").style.display = "none";
      document.getElementById("aim").style.display = "none";
      document.getElementById("back").style.display = "none";
      document.getElementById("yellowSquare").style.display = "none";
      document.getElementById("redSquare").style.display = "none";
      document.getElementById("greenSquare").style.display = "none";
      document.getElementById("yellowSight").style.display = "none";
      document.getElementById("redSight").style.display = "none";
      document.getElementById("greenSight").style.display = "none";
      document.getElementById("myCanvas").style.display = "block";
    }

    function displayLosingScreen(){
      document.getElementById("myCanvasMenu").style.display = "block";
      document.getElementById("gameOver").style.display = "block";
    }

    function togglePause(){
      isRunning = !isRunning;

      if(isRunning){
        requestAnimationFrame(mainLoop);
      }
    }

    function addScore(inc) {
      var new_val = Number(val_score);
      new_val += inc;
      val_score = new_val.toString();
    }

    // display healthpoint
    function displayHealthPoints(){
      ctx.save();

      ctx.font = "20px sans-serif";
      ctx.fillText("HP : " + healthpoint,w-87,40);

      ctx.restore();
    }
    // display Score
    function displayScore(){
      if(val_score !== undefined) {
        score = new Score("Score : " + val_score,5,90);
        score.draw(ctx);
      }
    }

     // clears the canvas content
    function clearCanvas() {
       ctx.clearRect(0, 0, w, h);
    }

    // CRATES
    // create crates
    function createCrates(n){
      for (let i = 0; i < n; i++) {
        let x = 40 + (i*300);
        let y = h - floor;
        let image = assets.crate;

        let crate = new Crate(x, y, image);
        crates.push(crate);
      }
    }

    // draw crates
    function drawCrates() {
      crates.forEach((c) => {
        c.draw(ctx);
      })
    }

    //draw bullet hole
    function drawBulletHoles(){
      bulletHoles.forEach((b)=>{
        ctx.save();

        ctx.drawImage(assets.bulletHole,b.x,b.y);

        ctx.restore();

      })
    }

    // TARGETS
    // create targets
    function createTargets(n) {
      var timeO = 3000;
      // Create the first target
      createTarget();
      // Create the others every 3s.
      for(let i = 0;i<n-1;i++){
          setTimeout(createTarget,timeO);
          timeO += 3000;
      }
    }

    function createTarget(){
      // generate random in order to choose a side (left or right)
      let v = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
      if (v === 1) {

        let x = 0;
        let y = h - 300;
        let vx = Levels[currentLevel].speed;
        let vy = 0;

        let pdv = Levels[currentLevel].healthpoint;
        let target = new Target(id, x, y, vx, pdv, "right");
        target.extractSprites(assets.spriteSheetRight);
        targets.push(target);

      }
      else {
        let x = w - 45;
        let y = h - 300;
        let vx = -Levels[currentLevel].speed;
        let vy = 0;

        let pdv = Levels[currentLevel].healthpoint;
        let target = new Target(id, x, y, vx, pdv, "left");
        target.extractSprites(assets.spriteSheetLeft);
        targets.push(target);

      }

      id++;
    }

    // draw targets
    function drawTargets() {
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
        t.action = "left";
       }

        if(t.x < 0) {
        t.vx = -t.vx;
        t.x = 0
        t.sprite = new Sprite("right");
        t.extractSprites(assets.spriteSheetRight);
        t.action = "right";
        }
      });
    }

    function haveToShoot() {
      targets.forEach((t) => {
        var v = parseInt(Math.random() * 1000);
        if(v == 1 && !t.isShooting) {
          t.isShooting = true;
          t.vx = 0;
          t.sprite = new Sprite("tir");
          t.extractSprites(assets.spriteSheetLeft);
          t.action = "tir";
        }
      });
    }

    function clearShootings(){
      targets.forEach((t)=>{
        if(t.willShoot !== 0){
          clearInterval(t.willShoot);
        }
      })
    }

    function isHittingYou(){
      targets.forEach((t) => {
        if (t.isShooting === true && t.willShoot === 0) {
          let v = parseInt(Math.random() * 500);
          if(v == 1){
            t.isHittingYou = true;
            t.willShoot = setInterval(function(){
              if(!takeCover.isSafe()){
                healthpoint -= 10;
                if(healthpoint <= 0){
                  cancelAnimationFrame(requestID);
                  clearShootings();
                  displayLosingScreen();
                  setTimeout(()=>{
                    document.getElementById("gameOver").style.display = "none";
                    displayMenu();
                  },2000)
                }
              }
            },3000);
          }
        }
      });
    }

    function displayWarning(){
      targets.forEach((t) => {
        if (t.isHittingYou == true) {
          ctx.save();

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 10;
          ctx.strokeRect(0,0,w,h);

          ctx.restore();
          return;
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
          if(isSoundOn){
            assets.reloadSound.play();
          }
          idReload = setInterval(reload,500);
          isReloading = true;
        }
      }
      else
      {
        clearInterval(idReload);
        isReloading = false;
        reloading = false;
        if(isSoundOn){
          assets.reloadSound.stop();
        }
      }
    }

    function reload(){
        magazine.capacity += 1;
     }
  // update the targets and magazine state
  function targetsAndMagazineUpdate() {
    var isCrateHit = false;
    if (inputStates.mousedown === true && inputStates.mouseButton === 0 && boolClick === 1) {
      boolClick = 0;
      if (magazine.capacity > 0 && reloading !== true) {
        if(isSoundOn){
          assets.gunShotSound.play();
        }
        magazine.capacity -= 1;
        crates.forEach((c)=>{
          if (inputStates.mousePos.x >= c.x && inputStates.mousePos.x <= c.x + 128
            && inputStates.mousePos.y >= c.y && inputStates.mousePos.y <= c.y + 128) {
            bulletHoles.push({ 'x': inputStates.mousePos.x - 10, 'y': inputStates.mousePos.y - 10 });
            isCrateHit = true;
          }
        })
        if(isCrateHit === false){
          targets.forEach((t) => {
            switch (t.action) {
              case "tir":
                if (inputStates.mousePos.x > t.x + t.w * 35 / 100 && inputStates.mousePos.x < t.x + t.w * 62 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV == 10) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;

                } else if (inputStates.mousePos.x > t.x + t.w * 28 / 100 && inputStates.mousePos.x < t.x + t.w * 72 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

              case "right":
                if (inputStates.mousePos.x > t.x + t.w * 45 / 100 && inputStates.mousePos.x < t.x + t.w * 78 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV == 10) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;

                } else if (inputStates.mousePos.x > t.x + t.w * 38 / 100 && inputStates.mousePos.x < t.x + t.w * 72 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h * 40 / 100) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

              case "left":
                if (inputStates.mousePos.x > t.x + t.w * 25 / 100 && inputStates.mousePos.x < t.x + t.w * 46 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV == 10) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;

                } else if (inputStates.mousePos.x > t.x + t.w * 28 / 100 && inputStates.mousePos.x < t.x + t.w * 62 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

            }

            if (t.pointDV <= 0) {
              let index = targets.findIndex(item => item.id === t.id);
              targets[index].sprite = new Sprite("explosion");
              targets[index].extractSprites(assets.spriteSheetLeft);
              setTimeout(() => { targets = targets.filter((target) => target.id !== t.id); }, 100);
              targetsKilled += 1;
            }
          })
        }
      }
      else {
        if(isSoundOn){
          assets.emptyGunSound.play();
        }
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
      if(inputStates.shift === true){
        takeCover.moveToTheTop(h);
      }
      else if(inputStates.shift === false) {
        takeCover.moveToTheBottom(h);
      }
    }

    // draw background
    function drawBackgrounds(){
      backgrounds.forEach((b)=>{
        b.draw(ctx,w,h);
      })
    }

    function moveBackgrounds(){
      if(backgrounds[currentBackground+1].x <= 0){
        backgrounds.forEach((b) => {
          b.move();
        })
      }
      else
      {
        clearInterval(idBackground);
        backgroundsAreMoving = false;
        currentBackground += 1;
      }
    }
    function createLevels(){
      for(let i = 0; i<4;i++){
        let id = 1 + i;
        let nOt = 2*(i+1);
        let speed = 0.5 + i;
        let hp = 10;

        let level = new Level(id,nOt,speed,hp);
        Levels.push(level);
      }
    }
    // switch level
    function nextLevel(){
      backgroundsAreMoving = true;
      currentLevel += 1;
      targetsKilled = 0;
      bulletHoles.length = 0;
      idBackground = setInterval(moveBackgrounds,1000/60);
    }
    // MAIN LOOP

    var mainLoop = function(time){

        // measure the frames per second
        measureFPS(time);
        // clear the canvas
        clearCanvas();
        // draw background
        drawBackgrounds();

        if(backgroundsAreMoving === false){
          // display the fps on the top-left corner
          displayFPS();

          // display the player's healthpoints
          displayHealthPoints();

          // display the score on the top-left corner
          displayScore();

          // draw Magazine
          drawMagazine();

          // draw the targets
          drawTargets();

          // draw the crates
          drawCrates();
          drawBulletHoles();

          // take cover
          drawTakeCover();

          // draw the weapon sight
          drawSight();

          // display warning
          displayWarning();
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
        if(isRunning){
        requestID = requestAnimationFrame(mainLoop);
        }
    };

    // Update the game components
    function updateGameState(){
      targetsAndMagazineUpdate();
      takeCoverUpdate();
      checkForReload();
      haveToShoot();
      isHittingYou();
      if (targetsKilled === 0 && backgroundsAreMoving === false && targets.length === 0){
        createTargets(Levels[currentLevel].numberOfTargets);
      }
      if(targetsKilled === Levels[currentLevel].numberOfTargets && backgroundsAreMoving === false){
        nextLevel();
      }
    }

    // MAGAZINE

    function drawMagazine(){
      magazine.draw(ctx);
    }


    function initialize(){
      healthpoint = 100;
      Levels.length = 0;
      bulletHoles.length = 0;
      targets.length = 0;
      createLevels();
      createTargets(Levels[currentLevel].numberOfTargets);
      createCrates(3);
      takeCover = new TakeCover(w, h, assets.coverTexture);
      magazine = new Magazine(10, assets.bullet);
      val_score = "0";
    }
    // ASSETS
    function allAssetsLoaded(assetsLoaded){
        assets = assetsLoaded;
        backgrounds[0] = new Background(0, 0, assets.background_1);
        backgrounds[1] = new Background(-w,0,assets.background_2);
        backgrounds[2] = new Background((-w) * 2, 0, assets.background_3);
        backgrounds[3] = new Background((-w) * 3, 0, assets.background_4);
    }


    // Draw the weapon sight is the mouse position is in the canvas
    function drawSight(){
      if(inputStates.mousePos != undefined){
      let x = inputStates.mousePos.x;
      let y = inputStates.mousePos.y;

      ctx.save();
      ctx.strokeStyle = sightColor;
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
          switch(event.keyCode){
            case 16:
              inputStates.shift = true;
              break;
            case 82:
              inputStates.r = true;
              break;
            case 27:
              if(isRunning){
                if(isReloading === true){
                  clearInterval(idReload);
                  if (isSoundOn) {
                    assets.reloadSound.stop();
                  }
                }
                togglePause();
                displayMenu();
              }
              else
              {
                togglePause();
                hideMenu();
                isReloading = false;
              }
              break;
            default:
          }
        },
          false);


      window.addEventListener('keyup', function(event){
          if (event.keyCode === 16) {
             inputStates.shift = false;
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


      loadAssets((assetsLoaded) => {
        allAssetsLoaded(assetsLoaded);
        initialize();
        requestID = requestAnimationFrame(mainLoop);
      })
    };


    return {
        start: start,
        displayMenu : displayMenu
    };
};
