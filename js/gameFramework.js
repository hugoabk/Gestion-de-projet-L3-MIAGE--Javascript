 //var for assets
var assets;
// Inits
window.onload = function init() {
  var game = new GF();
  loadAssets((assetsLoaded) => {
    game.allAssetsLoaded(assetsLoaded);
    document.getElementById("play").style.display = "block";
    document.getElementById("play").onclick = function () {
      document.getElementById("target").style.display = "none";
      document.getElementById("play").style.display = "none";
      assets.gunShotSound.play();
      game.initializeScore();
      game.displayMenu();
      assets.backgroundMusic.play();
    }
  })
};




// GAME FRAMEWORK STARTS HERE
var GF = function () {
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
  var sightColor = "red";

  // vars for handling inputs
  var inputStates = {};

  // vars for handling targets
  var id = 0;
  var targets = [];
  var targetsKilled = 0;

  // var for handling cover
  var takeCover;

  // var for click
  var boolClick = 1;

  // var for ammunitions
  var magazine;
  var reloading;
  var isReloading = false;
  var idReload;

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
  var floor;
  var bulletHoles = [];

  // var requested to cancel the animation
  var requestID;

  var measureFPS = function (newTime) {

    // test for the very first invocation
    if (lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    //calculates the difference between last & current frame
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }

    frameCount++;
  };

  // displays FPS
  function displayFPS() {
    if (fps !== undefined) {
      ctx.save();

      ctx.font = "10px sans-serif";
      ctx.fillText("FPS : " + fps, w - 50, 15);

      ctx.restore();
    }
  }
  // displays the main menu
  function displayMenu() {
    document.getElementById("myCanvasMenu").style.display = "block";
    document.getElementById("viseur").style.display = "block";
    document.getElementById("jouer").style.display = "block";
    document.getElementById("score").style.display = "block";
    document.getElementById("parametre").style.display = "block";

    var play = document.getElementById("jouer");
    // Launches the game or resume the game when you click on play
    play.onclick = function () {
      hideMenu();

      if (!isRunning) {
        togglePause();
      }
      else {
        start();
      }
    };

    var score_menu = document.getElementById("score");
    // displays the highscore when you click on score
    score_menu.onclick = function () {
      document.getElementById("jouer").style.display = "none";
      document.getElementById("score").style.display = "none";
      document.getElementById("parametre").style.display = "none";
      document.getElementById("score_value").style.display = "block";
      document.getElementById("back").style.display = "block";
    };

    var parameter = document.getElementById("parametre");
    // displays the parameters when you click on parameter
    parameter.onclick = function () {
      document.getElementById("jouer").style.display = "none";
      document.getElementById("score").style.display = "none";
      document.getElementById("parametre").style.display = "none";
      if (isSoundOn) {
        document.getElementById("speaker").style.display = "block";
      }
      else {
        document.getElementById("mute").style.display = "block";
      }
      document.getElementById("sound").style.display = "block";
      document.getElementById("aim").style.display = "block";
      document.getElementById("back").style.display = "block";
      document.getElementById("yellowSight").style.display = "block";
      document.getElementById("redSight").style.display = "block";
      document.getElementById("greenSight").style.display = "block";
      switch (sightColor) {
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
      assets.backgroundMusic.pause();
      isSoundOn = false;
    };

    var mute = document.getElementById("mute");
    mute.onclick = function () {
      isSoundOn = true;
      assets.backgroundMusic.play();
      document.getElementById("mute").style.display = "none";
      document.getElementById("speaker").style.display = "block";
    };

    // back button used for going back to the menu
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
      document.getElementById("score_value").style.display = "none";
    };

  }
  // hides every menu elements
  function hideMenu() {
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
    document.getElementById("score_value").style.display = "none";
  }

  // displays the game over screen
  function displayLosingScreen() {
    document.getElementById("myCanvasMenu").style.display = "block";
    document.getElementById("gameOver").style.display = "block";
  }

  // updates the score element with the value from the local storage
  function updateScore() {
    document.getElementById("score_value").innerHTML = "Highscore : " + window.localStorage.getItem('name') + " - " + window.localStorage.getItem('score');
  }

  // allows the main animation to pause / resume
  function togglePause() {
    isRunning = !isRunning;

    if (isRunning) {
      requestAnimationFrame(mainLoop);
    }
  }

  // add value to the score in game
  function addScore(inc) {
    var new_val = Number(val_score);
    new_val += inc;
    val_score = new_val.toString();
  }

  // displays the health points in game
  function displayHealthPoints() {
    ctx.save();

    ctx.font = '20px OCR A Std, monospace';
    ctx.fillText("HP : " + healthpoint, w - 95, 40);

    ctx.restore();
  }
  // displays the score
  function displayScore() {
    if (val_score !== undefined) {
      score = new Score("Score : " + val_score, 5, 90);
      score.draw(ctx);
    }
  }

  // initialize score and name in the local storage
  function initializeScore() {
    if (!window.localStorage.getItem('score'))
      window.localStorage.setItem("score", "0");
      window.localStorage.setItem("name", "DEFAULT");
    document.getElementById("score_value").innerHTML = "Highscore : " + window.localStorage.getItem('name') + " - " + window.localStorage.getItem('score');
  }

  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
  }

  // CRATES
  // creates crates
  function createCrates(n) {
    for (let i = 0; i < n; i++) {
      let x = 40 + (i * 300);
      let y = floor + 50;
      let image = assets.crate;

      let crate = new Crate(x, y, image);
      crates.push(crate);
    }
  }

  // draws crates
  function drawCrates() {
    crates.forEach((c) => {
      c.draw(ctx);
    })
  }

  //draws bullet holes
  function drawBulletHoles() {
    bulletHoles.forEach((b) => {
      ctx.save();

      ctx.drawImage(assets.bulletHole, b.x, b.y);

      ctx.restore();

    })
  }

  // TARGETS
  // creates targets
  function createTargets(n) {
    var timeO = Levels[currentLevel].spawnInterval;
    // Creates the first target
    createTarget();
    // Creates the others every 3s.
    for (let i = 0; i < n - 1; i++) {
      setTimeout(createTarget, timeO);
      timeO += Levels[currentLevel].spawnInterval;
    }
  }
  // create one target
  function createTarget() {
    // generates random in order to choose a side (left or right)
    let v = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    if (v === 1) {

      let x = 0;
      let y = floor;
      let vx = Levels[currentLevel].speed;


      let pdv = Levels[currentLevel].healthpoint;
      let target = new Target(id, x, y, vx, pdv, "right");
      target.extractSprites(assets.spriteSheetRight);
      targets.push(target);

    }
    else {
      let x = w - 45;
      let y = floor;
      let vx = -Levels[currentLevel].speed;


      let pdv = Levels[currentLevel].healthpoint;
      let target = new Target(id, x, y, vx, pdv, "left");
      target.extractSprites(assets.spriteSheetLeft);
      targets.push(target);

    }

    id++;
  }

  // draws targets
  function drawTargets() {
    targets.forEach((t) => {
      t.draw(ctx);
    })
  }
  // collision check for the targets
  function targetsCollision() {
    targets.forEach((t) => {
      if (((t.x + t.w) > w)) {
        t.vx = -t.vx;
        t.x = w - t.w;
        t.sprite = new Sprite("left");
        t.extractSprites(assets.spriteSheetLeft);
        t.action = "left";
      }

      if (t.x < 0) {
        t.vx = -t.vx;
        t.x = 0
        t.sprite = new Sprite("right");
        t.extractSprites(assets.spriteSheetRight);
        t.action = "right";
      }
    });
  }

  // generates a random number for each target in order to know if they should shoot at the player or not
  function haveToShoot() {
    targets.forEach((t) => {
      var v = parseInt(Math.random() * 300);
      if (v === 1 && !t.isShooting) {
        t.isShooting = true;
        t.vx = 0;
        t.sprite = new Sprite("tir");
        t.extractSprites(assets.spriteSheetLeft);
        t.action = "tir";
      }
    });
  }
  // clear all the shootings (when the game is over for instance)
  function clearShootings() {
    targets.forEach((t) => {
      if (t.willShoot !== 0) {
        clearInterval(t.willShoot);
      }
    })
  }
 // generates a random number for each target in order to know if they should hit the player or not
  function isHittingYou() {
    targets.forEach((t) => {
      if (t.isShooting === true && t.willShoot === 0) {
        let v = parseInt(Math.random() * 300);
        if (v === 1) {
          t.isHittingYou = true;
          // the target will hit you every 3 seconds
          t.willShoot = setInterval(function () {
            if (!takeCover.isSafe()) {
              if(isRunning){
                healthpoint -= 10;
              }
              // if the player is dead
              if (healthpoint <= 0) {
                cancelAnimationFrame(requestID);
                clearShootings();
                document.getElementById("myCanvas").style.display = "none";
                displayLosingScreen();
                // updates score in the storage is the new score is superior
                if (val_score > Number(window.localStorage.getItem('score'))){
                  var name = prompt("NEW HIGHSCORE !\nPlease enter your name :");
                  if(name){
                    window.localStorage.setItem('name',name);
                  }
                  else{
                    window.localStorage.setItem('name', "UNKNOWN");
                  }
                  window.localStorage.setItem("score", val_score);
                  updateScore();
                }
                setTimeout(() => {
                  document.getElementById("gameOver").style.display = "none";
                  displayMenu();
                }, 2000)
              }
            }
          }, 3000);
        }
      }
    });
  }
  // displays the red frame when the player is hit by the target
  function displayWarning() {
    targets.forEach((t) => {
      if (t.isHittingYou === true) {
        ctx.save();

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, w, h);

        ctx.restore();
        return;
      }
    });
  }
  // checks if the gun has to be reloaded or not when the player hit the R key
  function checkForReload() {
    if (inputStates.r === true) {
      if (magazine.capacity < magazine.capacityMax) {
        reloading = true;
      }
    }
    // if the gun is not full and the player asked a reload
    if (magazine.capacity < magazine.capacityMax && reloading === true) {
      // if the gun is not already being reloaded, reload it
      if (isReloading === false) {
        if (isSoundOn) {
          assets.reloadSound.play();
        }
        idReload = setInterval(reload, 500);
        isReloading = true;
      }
    }
    // else the gun is full, stop the reloading
    else {
      clearInterval(idReload);
      isReloading = false;
      reloading = false;
      if (isSoundOn) {
        assets.reloadSound.stop();
      }
    }
  }
  // reload the gun one ammo by one ammo
  function reload() {
    magazine.capacity += 1;
  }
  // update the targets and magazine state
  function targetsAndMagazineUpdate() {
    var isCrateHit = false;
    if (inputStates.mousedown === true && inputStates.mouseButton === 0 && boolClick === 1) {
      boolClick = 0;
      if (magazine.capacity > 0 && reloading !== true) {
        if (isSoundOn) {
          assets.gunShotSound.play();
        }
        magazine.capacity -= 1;
        // if the player is hitting a crate, isCrateHit = true
        crates.forEach((c) => {
          if (inputStates.mousePos.x >= c.x && inputStates.mousePos.x <= c.x + 128
            && inputStates.mousePos.y >= c.y && inputStates.mousePos.y <= c.y + 128) {
            bulletHoles.push({ 'x': inputStates.mousePos.x - 10, 'y': inputStates.mousePos.y - 10 });
            isCrateHit = true;
          }
        })
        // if the player is not hitting a crate
        if (isCrateHit === false) {
          targets.forEach((t) => {
            // defines the hitbox for each case, when the target is shooting, moving to the left, moving the right
            switch (t.action) {
              case "tir":
              // headshot
                if (inputStates.mousePos.x > t.x + t.w * 35 / 100 && inputStates.mousePos.x < t.x + t.w * 62 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV === Levels[currentLevel].healthpoint) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;
              //bodyshot
                } else if (inputStates.mousePos.x > t.x + t.w * 28 / 100 && inputStates.mousePos.x < t.x + t.w * 72 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

              case "right":
              // headshot
                if (inputStates.mousePos.x > t.x + t.w * 45 / 100 && inputStates.mousePos.x < t.x + t.w * 78 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV === Levels[currentLevel].healthpoint) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;
                //bodyshot
                } else if (inputStates.mousePos.x > t.x + t.w * 32 / 100 && inputStates.mousePos.x < t.x + t.w * 78 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

              case "left":
              // headshot
                if (inputStates.mousePos.x > t.x + t.w * 25 / 100 && inputStates.mousePos.x < t.x + t.w * 58 / 100
                  && inputStates.mousePos.y > t.y && inputStates.mousePos.y < t.y + t.h * 20 / 100) {

                  if (t.pointDV === Levels[currentLevel].healthpoint) {
                    addScore(100);
                  }
                  else {
                    addScore(20);
                  }
                  t.pointDV = 0;
              //bodyshot
                } else if (inputStates.mousePos.x > t.x + t.w * 28 / 100 && inputStates.mousePos.x < t.x + t.w * 74 / 100
                  && inputStates.mousePos.y > t.y + t.h * 21 / 100 && inputStates.mousePos.y < t.y + t.h) {
                  t.pointDV -= 4;
                  addScore(20);
                }
                break;

            }
            // if the target is dead
            if (t.pointDV <= 0) {
              let index = targets.findIndex(item => item.id === t.id);
              targets[index].sprite = new Sprite("explosion");
              targets[index].extractSprites(assets.spriteSheetLeft);
              setTimeout(() => { targets = targets.filter((target) => target.id !== t.id); }, 100);
              clearInterval(t.willShoot);
              targetsKilled += 1;
            }
          })
        }
      }
      else {
        if (isSoundOn) {
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
  function drawTakeCover() {
    takeCover.draw(ctx);
  }

  // updates the cover state
  function takeCoverUpdate() {
    if (inputStates.shift === true) {
      takeCover.moveToTheTop(h);
    }
    else if (inputStates.shift === false) {
      takeCover.moveToTheBottom(h);
    }
  }

  // draws background
  function drawBackgrounds() {
    backgrounds.forEach((b) => {
      b.draw(ctx, w, h);
    })
  }
  // moves the backgrounds until the next background is displaying on the canvas
  function moveBackgrounds() {
    if (backgrounds[currentBackground + 1].x <= 0) {
      backgrounds.forEach((b) => {
        b.move();
      })
    }
    else {
      clearInterval(idBackground);
      backgroundsAreMoving = false;
      currentBackground += 1;
      floor = backgrounds[currentBackground].floor;
      createCrates(3);
    }
  }

  // creates all the levels, defining the difficulty with several parameters
  function createLevels() {
    for (let i = 0; i < 14; i++) {
      let id = 1 + i;
      let nOt = 4 * (i + 1);
      let speed = 0.5 + (i/2);
      let spawnInterval = 3000 - (i*200);
      let hp = 10;

      let level = new Level(id, nOt, speed, hp, spawnInterval);
      Levels.push(level);
    }
  }
  // switches to the next level
  function nextLevel() {
    backgroundsAreMoving = true;
    currentLevel += 1;
    targetsKilled = 0;
    crates.length = 0;
    bulletHoles.length = 0;
    idBackground = setInterval(moveBackgrounds, 1000 / 60);
  }

  // MAIN LOOP

  var mainLoop = function (time) {

    // measure the frames per second
    measureFPS(time);
    // clear the canvas
    clearCanvas();
    // draw background
    drawBackgrounds();

    // if there is no switch to the next level
    if (backgroundsAreMoving === false) {
      // displays the fps on the top-left corner
      displayFPS();

      // displays the player's healthpoints
      displayHealthPoints();

      // displays the score on the top-left corner
      displayScore();

      // draws Magazine
      drawMagazine();

      // draws the targets
      drawTargets();

      // draws the crates
      drawCrates();
      drawBulletHoles();

      // draws the cover
      drawTakeCover();

      // draws the weapon sight
      drawSight();

      // displays warning
      displayWarning();
    }
    else {
      // displays the black frame and the "Level X"
      ctx.save()

      ctx.fillStyle = "black";

      ctx.fillRect(0, 0, w, 50);
      ctx.fillRect(0, h - 50, w, 50);
      ctx.font = '50px OCR A Std, monospace';
      ctx.fillText("Level " + (currentLevel + 1) + " / 14", (w/2) - 200, h/2);
      ctx.restore();
    }
    // Checks inputs and update the game state
    updateGameState();

    // call the animation loop every 1/60th of second
    if (isRunning) {
      requestID = requestAnimationFrame(mainLoop);
    }
  };

  // Updates the game components
  function updateGameState() {
    targetsAndMagazineUpdate();
    takeCoverUpdate();
    checkForReload();
    haveToShoot();
    isHittingYou();
    if (targetsKilled === 0 && backgroundsAreMoving === false && targets.length === 0) {
      createTargets(Levels[currentLevel].numberOfTargets);
    }
    if (targetsKilled === Levels[currentLevel].numberOfTargets && backgroundsAreMoving === false) {
      nextLevel();
    }
  }

  // MAGAZINE

  function drawMagazine() {
    magazine.draw(ctx);
  }

  // Initializes the game elements
  function initialize() {
    backgrounds[0] = new Background(0, 0, assets.backgroundBase, h - 300);
    backgrounds[1] = new Background(-w, 0, assets.backgroundForest, h - 300);
    backgrounds[2] = new Background(-(w*2), 0, assets.backgroundOcean, h - 200);
    backgrounds[3] = new Background(-(w * 3), 0, assets.backgroundChaos, h - 300);
    backgrounds[4] = new Background(-(w * 4), 0, assets.backgroundDesert, h -230);
    backgrounds[5] = new Background(-(w * 5), 0, assets.backgroundCity, h - 300);
    backgrounds[6] = new Background(-(w * 6), 0, assets.backgroundDarkForest, h - 300);
    backgrounds[7] = new Background(-(w * 7), 0, assets.backgroundBase, h - 300);
    backgrounds[8] = new Background(-(w * 8), 0, assets.backgroundForest, h - 300);
    backgrounds[9] = new Background(-(w * 9), 0, assets.backgroundOcean, h - 200);
    backgrounds[10] = new Background(-(w * 10), 0, assets.backgroundChaos, h - 300);
    backgrounds[11] = new Background(-(w * 11), 0, assets.backgroundDesert, h - 230);
    backgrounds[12] = new Background(-(w * 12), 0, assets.backgroundCity, h - 300);
    backgrounds[13] = new Background(-(w * 13), 0, assets.backgroundDarkForest, h - 300);

    floor =  backgrounds[currentBackground].floor;
    healthpoint = 100;
    Levels.length = 0;
    bulletHoles.length = 0;
    targets.length = 0;
    currentLevel = 0;
    currentBackground = 0;
    createLevels();
    createTargets(Levels[currentLevel].numberOfTargets);
    createCrates(3);
    takeCover = new TakeCover(w, h, assets.coverTexture);
    magazine = new Magazine(6, assets.bullet);
    val_score = "0";
  }
  // ASSETS
  function allAssetsLoaded(assetsLoaded) {
    assets = assetsLoaded;
  }


  // Draws the weapon sight if the mouse position is in the canvas
  function drawSight() {
    if (inputStates.mousePos !== undefined) {
      let x = inputStates.mousePos.x;
      let y = inputStates.mousePos.y;

      ctx.save();
      ctx.strokeStyle = sightColor;
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x - 5, y);
      ctx.moveTo(x + 20, y);
      ctx.lineTo(x + 5, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y - 20);
      ctx.lineTo(x, y - 5);
      ctx.moveTo(x, y + 20);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
      ctx.restore();
    }
  }
 // gets the mouse position
  function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    // If the mouse position is in the canvas then it returns the position
    if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      // Else it just returns undefined
    } else {
      return {
        x: undefined,
        y: undefined
      }
    }
  }

  var start = function () {

    document.getElementById("myCanvas").style.display = "block";
    canvas = document.querySelector("#myCanvas");
    canvas.style.cursor = "none";

    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');


    // Add the listeners for the reloading key, the escape (pause) key and the take cover key

    window.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        case 16:
          inputStates.shift = true;
          break;
        case 82:
          inputStates.r = true;
          break;
        case 27:
          if (isRunning) {
            if (isReloading === true) {
              clearInterval(idReload);
              if (isSoundOn) {
                assets.reloadSound.stop();
              }
            }
            togglePause();
            document.getElementById("myCanvas").style.display = "none";
            displayMenu();
          }
          else {
            togglePause();
            hideMenu();
            document.getElementById("myCanvas").style.display = "block";
            isReloading = false;
          }
          break;
        default:
      }
    },
      false);


    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 16) {
        inputStates.shift = false;
      } else if (event.keyCode === 82) {
        inputStates.r = false;
      }
    },
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


    initialize();
    requestID = requestAnimationFrame(mainLoop);
  };

  // returns all the functions we have to use outside of the game framework
  return {
    start: start,
    displayMenu: displayMenu,
    allAssetsLoaded: allAssetsLoaded,
    initializeScore: initializeScore
  };
};
