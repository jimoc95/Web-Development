//declaring the variables - if you declare these variables inside a function they are only available in the function - if i declare them up here they are available everywhere - global
let canvas; 
let context;
// we use our three variables for throttling - here we have chosen 30 frames per second
let request_id;
let xhttp;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let player = {
    x : 0, 
    y : 0,
    width : 24,
    height : 34,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0,
};

let castle = {
    x : 340, 
    y : 80,
    width : 125,
    height : 125
};

let wall_left = {
    x : 96, 
    y : 384,
    width : 160,
    height : 16
};

let wall_right = {
    x : 544, 
    y : 384,
    width : 160,
    height : 16
};

let wall_middle = {
    x : 320, 
    y : 288,
    width : 160,
    height : 16
};

let rocks = {
    x : 670, 
    y : 96,
    width : 64,
    height : 112
};

let hole = {
    x : 64, 
    y : 80,
    width : 64,
    height : 64
};

let enemies = [];
let horses = [];
let levelUp = [];

let moveLeft = false; 
let moveUp = false;
let moveRight = false;
let moveDown = false;
let shoot = false;

let outcome = 0;


// this will tell me which image I want to draw on my canvas from my background tileset
let background = [
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 75, 74, 75, 74, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 74, 92, 93, 75, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 52, 53, 54, 55, 45, 45, 45, 45],
    [45, 45, 45, 45, 75, 113, 114, 74, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 73, 74, 75, 76, 45, 45, 45, 45],
    [45, 45, 45, 45, 74, 75, 74, 75, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 94, 95, 96, 97, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 115, 116, 117, 118, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 136, 137, 138, 139, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 157, 158, 159, 160, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 3, 4, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 178, 179, 180, 181, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 24, 25, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 95, 96, 95, 96, 95, 96, 95, 96, 95, 96, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 174],
    [45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 3, 4, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 95, 96, 95, 96, 95, 96, 95, 96, 95, 96, 45, 45, 45, 45, 45, 45, 45, 45, 45, 24, 25, 45, 45, 45, 45, 45, 45, 45, 96, 95, 96, 95, 96, 95, 96, 95, 96, 95, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 91, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
];

let tilesPerRow = 21;
let tileSize = 16;

let IMAGES = {player: "static/player_walk2.png", background: "static/overworld.png", 
              e: "static/enemy_walk.png", h: "static/horse-brown.png", castle: "static/castle.gif",
              levelUp: "static/ruby.png"};

// this runs the function but not just at any time - it says don't run the function until the webpage has been loaded - calls init() once it has been loaded
document.addEventListener("DOMContentLoaded", init, false); 

function init() {
    // this variable goes to the webpage and finds the canvas
    canvas = document.querySelector("canvas"); 
    // create the context - this variable that does the drawing
    context = canvas.getContext("2d");        
    
    // we want the players x to be half the canvas width
    player.x = canvas.width / 2;
    player.y = (0, canvas.height - player.height);
   
    // we add an event listener to listen for the user pressing a key ("keydown") and when they press a key I want to run a function which you can call what you like
    window.addEventListener("keydown", activate, false);
    // we also need a function to listen for the opposite - when they release a key ("keyup") - when they release a key we will call the deactivate function
    window.addEventListener("keyup", deactivate, false);

    load_images(draw);
}    

function draw() {
    // this is a special function which is a loop that runs forever - so it will keep calling draw - this line creates the animation
    // we put it equal to the variable request_id so that we can stop the animation once the game has ended
    request_id = window.requestAnimationFrame(draw);
    // this code makes the program more professional - if we run this program on a slow laptop it will be slow, on a fast laptop it will be fast - maybe too fast
    // for fast laptops this will throttle them down and make them behave not too fast - if the laptop is too fast it will make sure we still only get 30 fps as we have defined above
    let now = Date.now();
    // next time we do the drawing - we take the time now and subtract the last time we did the drawing - so elapsed is how long ago we did the last drawing
    let elapsed = now - then;
    // if the time since the last drawing is too small we don't draw the rectangle, we wait a bit
    if (elapsed <= fpsInterval) {
        return;
    }
    // this works out the time at which it is doing the drawing
    then  = now - (elapsed % fpsInterval);
    // if there are less than 6 enemies draw an enemy and add it to the list
    if (enemies.length < 6) {
        // 
        let e = {
            x : randint(0, canvas.width), 
            y : randint(0, canvas.height),
            width : 16,
            height : 24,
            frameX : 0,
            frameY : 0,
            xChange : randint(-1, 1),
            yChange : randint(-1, 1)
        };
        // We are going to stick these enemies onto the empty list we created earlier
        enemies.push(e);
    }
    // if there are less than 8 horses draw an enemy and add it to the list
    if (horses.length < 8) {
        let h = {
            x : randint(0, canvas.width), 
            y : randint(0, canvas.height),
            width : 64,
            height : 64,
            frameX : 0,
            frameY : 0,
            xChange : randint(-1, 1),
            yChange : randint(-1, 1)
        };
        // We are going to stick these into the empty list we created earlier
        horses.push(h);
    }

    if (levelUp.length < 5) {
        let l = {
            x : randint(0, canvas.width), 
            y : randint(0, canvas.height),
            width : 24,
            height : 24,
        };
        // We are going to stick these into the empty list we created earlier
        levelUp.push(l);
    }
    // Draw background on canvas
    context.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    context.fillStyle = "#9ACD32"; // light green - colouring the entire canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw black background for the hole which we will put the tiles from the background image over
    context.fillStyle = "black"; 
    context.fillRect(hole.x, hole.y, hole.width, hole.height);

      // a loop within a loop, first one to go through the lists in our background and the second one to go through the numbers in those lists
    for (let r = 0; r < 30; r += 1) {
        for (let c = 0; c < 50; c += 1) {
            let tile = background[r][c];    // tile is the value inside the list within the list
            if (tile >= 0) {                // if that value is greater or equal to zero..
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(IMAGES.background,    
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize)
            }
        }
    }
    //Draw player
    context.fillStyle = "green"; 
    context.drawImage(IMAGES.player,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight) && ! (moveLeft && moveRight)) {
        player.frameX = player.frameX + 1;
        player.frameX = (player.frameX + 1) % 4;
        
    }
    // //Draw other objects 
    context.fillStyle = "purple"; 
    context.drawImage(IMAGES.castle, 
        castle.x, castle.y, castle.width, castle.height);
    
    // Make the square drawn for the house transparent so that we can use the background image but still not allow player, enemies, horses to walk over it.
    context.fillStyle = "rgba(255, 255, 255, 0)"; 
    context.fillRect(wall_left.x, wall_left.y, wall_left.width, wall_left.height);

    context.fillStyle = "rgba(255, 255, 255, 0)"; 
    context.fillRect(wall_right.x, wall_right.y, wall_right.width, wall_right.height);

    context.fillStyle = "rgba(255, 255, 255, 0)"; 
    context.fillRect(wall_middle.x, wall_middle.y, wall_middle.width, wall_middle.height);


    context.fillStyle = "rgba(255, 255, 255, 0)"; 
    context.fillRect(rocks.x, rocks.y, rocks.width, rocks.height);

    context.fillStyle = "rgba(255, 255, 255, 0)"; 
    context.fillRect(hole.x, hole.y, hole.width, hole.height);

    // Draw enemy
    context.fillStyle = "red"; 
    for (let e of enemies) {
       
        context.drawImage(IMAGES.e,
            e.frameX * e.width, e.frameY * e.height, e.width, e.height,
            e.x, e.y, e.width, e.height);  
            if (e.x > 0 || e.x < 0) {
                e.frameX = e.frameX + 1;
                e.frameX = (e.frameX + 1) % 4;
            }
    }
    // Draw the horses
    context.fillStyle = "brown"; 
    for (let h of horses) {
        context.drawImage(IMAGES.h,
            h.frameX * h.width, h.frameY * h.height, h.width, h.height,
            h.x, h.y, h.width/2, h.height/2);  
            if (h.x > 0 || h.x < 0) {
                h.frameX = h.frameX + 1;
                h.frameX = (h.frameX + 1) % 3;
            }
        }
    // Draw the rubies (levelUp)
    context.fillStyle = "black"; 
    for (let l of levelUp) {
        context.drawImage(IMAGES.levelUp,
            l.x, l.y, l.width, l.height);  
    }
  
    //Manage Player Collisions

    // if the player has collided with the castle and is to the left or the top of the castle move it up or to the left (reverse its direction)
    if ((player_collides_castle(castle)) && (player.x < castle.x || player.y < castle.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 
    // // if the player has collided with the castle and is to the right or the bottom of the castle move it down or to the left (reverse its direction)
    else if ((player_collides_castle(castle)) && (player.x > castle.x || player.y > castle.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }
    if ((player_collides_wall_left(wall_left)) && (player.x < wall_left.x || player.y < wall_left.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 
    else if ((player_collides_wall_left(wall_left)) && (player.x > wall_left.x || player.y > wall_left.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }
    
    if ((player_collides_wall_right(wall_right)) && (player.x < wall_right.x || player.y < wall_right.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 

    else if ((player_collides_wall_right(wall_right)) && (player.x > wall_right.x || player.y > wall_right.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }
  
    if ((player_collides_wall_middle(wall_middle)) && (player.x < wall_middle.x || player.y < wall_middle.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 

    else if ((player_collides_wall_middle(wall_middle)) && (player.x > wall_middle.x || player.y > wall_middle.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }
    
    if ((player_collides_rocks(rocks)) && (player.x < rocks.x || player.y < rocks.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 
   
    else if ((player_collides_rocks(rocks)) && (player.x > rocks.x || player.y > rocks.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }
  
    if ((player_collides_hole(hole)) && (player.x < hole.x || player.y < hole.y)) {
        player.xChange = -1;
        player.yChange = -1;
    } 
    
    else if ((player_collides_hole(hole)) && (player.x > hole.x || player.y > hole.y)) {
        player.xChange = 1;
        player.yChange = 1;
    }

    // changing enemy image depending on direction
    for (let e of enemies) {
        if (e.xChange > 0) {
            e.frameY = 3;
        } else if (e.xChange < 0) {
            e.frameY = 1;
        } else if (e.xChange === 0 && e.yChange > 0) {
            e.frameY = 2;
        } else if (e.xChange === 0 && e.yChange < 0) {
            e.frameY = 0;
        }
    }
    // Manage enemy collisions
    for (let e of enemies) {
        if (player_collides_enemy(e)) {
            // Give string containing the outcome (number of horses caught) so that it can be displayed the player
            stop("You Caught " + outcome + " Horses!");
            return;
        }
        // if the enemy has collided with the castle and is to the left or the top of the castle move it up or to the left (reverse its direction)
        else if ((enemy_collides_castle(e)) && (e.x < castle.x || e.y < castle.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
        // if the enemy has collided with the castle and is to the right or the bottom of the castle move it down or to the right (reverse its direction)
        else if ((enemy_collides_castle(e)) && (e.x > castle.x || e.y > castle.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }
        
        else if ((enemy_collides_wall_left(e)) && (e.x < wall_left.x || e.y < wall_left.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
  
        else if ((enemy_collides_wall_left(e)) && (e.x > wall_left.x || e.y > wall_left.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }
 
        else if ((enemy_collides_wall_right(e)) && (e.x < wall_right.x || e.y < wall_right.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
 
        else if ((enemy_collides_wall_right(e)) && (e.x > wall_right.x || e.y > wall_right.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }
   
        else if ((enemy_collides_wall_middle(e)) && (e.x < wall_middle.x || e.y < wall_middle.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
   
        else if ((enemy_collides_wall_middle(e)) && (e.x > wall_middle.x || e.y > wall_middle.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }
       
        else if ((enemy_collides_rocks(e)) && (e.x < rocks.x || e.y < rocks.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
       
        else if ((enemy_collides_rocks(e)) && (e.x > rocks.x || e.y > rocks.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }
       
        else if ((enemy_collides_hole(e)) && (e.x < hole.x || e.y < hole.y)) {
            e.xChange = -1;
            e.yChange = -1;
        } 
       
        else if ((enemy_collides_hole(e)) && (e.x > hole.x || e.y > hole.y)) {
            e.xChange = 1;
            e.yChange = 1;
        }

        // if middle of the player < 5 from middle of enemy and the enemy has not collided with any objects
        if (((player.x + (player.width/2) + (player.height/2)) - (e.x + (e.width/2) + (e.height/2)) < 0.8) && (enemy_collides_castle(e) === false && enemy_collides_wall_left(e)===false && enemy_collides_wall_middle(e)===false && enemy_collides_wall_right(e)===false && enemy_collides_rocks(e)===false && enemy_collides_hole(e)===false)){
            // player to the right of the enemy - increase players x - move enemy right (towards player)
            if (e.x < player.x) {
                e.xChange = 0.8;
            // Otherwise send enemy left
            } else if (e.x < player.x)  {
                e.xChange = -0.8
            } else if (e.x === player.x) {
                if (e.y > player.y){
                    e.xChange = -0.8
                }else if (e.y > player.y) {
                    e.xChange = 0.8
                }
            }
            // if the enemy is above the player increase enemy y - send enemy down
            if (e.y < player.y) {
                e.yChange = 0.8;
            // otherwise send enemy up
            } else if (e.y > player.y)  {
                e.yChange = -0.8
            // Otherwise if they have the same y coordinate - (on the same horizontal)
            } else if (e.y === player.y) {
                if (e.x > player.x){
                    e.xChange = -0.8
                } else if (e.x > player.x) {
                    e.xChange = 0.8
                }
            }
            // Otherwise if they have the same x coordinate - (on the same vertical)
            else if ((e.x === player.x)) {
                if (e.x > player.x){
                    e.xChange = -0.8
                } else if (e.x > player.x) {
                    e.xChange = 0.8
            }
        } else {
            e.x = e.x + e.xChange;
            e.y = e.y + e.yChange;
        }
    }
        
        // if the enemy's top right hand corner (a.x + a.size (top-left + length) x coordinate is < 0 i.e enemy has gone off the left side of the canvas 
        if (e.x + e.width < 0) {
            // We put the enemy back on the right edge of the canvas 
            e.x = canvas.width;
            // When we bring the enemy back on the right edge of the canvas we will bring it back at a random y value.
            e.y = randint(0, canvas.height);
        // going off right
        } else if ( e.x > canvas.width) {
            e.x = 0;
            e.y = randint(0, canvas.height);
        // going off top
        } else if (e.y + e.height < 0) {
            e.y = canvas.height;
            e.x = randint(0, canvas.width)
        // going off bottom
        } else if (e.y > canvas.height) {
            e.y = 0
            e.x = randint(0, canvas.width)
        }
        else {
            e.x = e.x + e.xChange;
            e.y = e.y + e.yChange;
        }
    }
    // changing horse image depending on direction
    for (let h of horses) {
        if (h.xChange > 0) {
            h.frameY = 1;
        } else if (h.xChange < 0) {
            h.frameY = 3;
        } else if (h.xChange === 0 && h.yChange > 0) {
            h.frameY = 2;
        } else if (h.xChange === 0 && h.yChange > 0) {
            h.frameY = 0;
        }
    }

    for (let h of horses) {
        // if the player collides with a horse
        if (player_collides_horse(h)) {
            // remove a horse from the list
            horses.splice(h);
            // increment the the outcome counter, so we can keep track of how many horses we have caught 
            outcome++;
            let e = {
                x : randint(0, canvas.width), 
                y : randint(0, canvas.height),
                width : 16,
                height : 24,
                frameX : 0,
                frameY : 0,
                xChange : randint(-2, 2),
                yChange : randint(-2, 2)
            };
            // If the player catches a horse, we add another enemy to the game.
            enemies.push(e);
        }
            
        // if the horse has collided with the castle and is to the left or the top of the castle move it up or to the left (reverse its direction)
        if ((horse_collides_castle(h)) && (h.x < castle.x || h.y < castle.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
        // if the horse has collided with the castle and is to the right or bottom of the castle move it down or to the right (reverse its direction)
        else if ((horse_collides_castle(h)) && (h.x > castle.x || h.y > castle.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }  
    
        else if ((horse_collides_wall_left(h)) && (h.x < wall_left.x || h.y < wall_left.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
       
        else if ((horse_collides_wall_left(h)) && (h.x > wall_left.x || h.y > wall_left.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }
 
        else if ((horse_collides_wall_right(h)) && (h.x < wall_right.x || h.y < wall_right.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
  
        else if ((horse_collides_wall_right(h)) && (h.x > wall_right.x || h.y > wall_right.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }

        else if ((horse_collides_wall_middle(h)) && (h.x < wall_middle.x || h.y < wall_middle.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
     
        else if ((horse_collides_wall_middle(h)) && (h.x > wall_middle.x || h.y > wall_middle.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }

        else if ((horse_collides_rocks(h)) && (h.x < rocks.x || h.y < rocks.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
        
        else if ((horse_collides_rocks(h)) && (h.x > rocks.x || h.y > rocks.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }
        
        else if ((horse_collides_hole(h)) && (h.x < hole.x || h.y < hole.y)) {
            h.xChange = -1;
            h.yChange = -1;
        } 
       
        else if ((horse_collides_hole(h)) && (h.x > hole.x || h.y > hole.y)) {
            h.xChange = 1;
            h.yChange = 1;
        }

        // If the middle of the player is less than 1 from the middle of the horse - make the horse run away from the player
         if (((player.x + (player.width/2) + (player.height/2)) - (h.x + (h.width/2) + (h.height/2)) < 1) && (horse_collides_castle(h) === false && horse_collides_wall_left(h) === false && horse_collides_wall_right(h) === false && horse_collides_wall_middle(h) === false && horse_collides_rocks(h) === false && horse_collides_hole(h) === false)) {
            if (h.x < player.x) {
                h.xChange = -1;
            } else {
                h.xChange = 1;
            }
            if (h.y < player.y) {
                h.yChange = -1;
            } else {
                h.yChange = 1;
            }
        } else {
            h.x = h.x + h.xChange;
            h.y = h.y + h.yChange;
        }  
        // if your top right hand corner's (a.x + a.size (top-left + length) x coordinate is < 0 i.e you've gone off the left side of the canvas 
        if (h.x + h.width < 0) {
            // We put you back on the right edge of the canvas - gives illusion of many squares but its just the same squares going off the left and coming back on the right.
            h.x = canvas.width;
            // When we bring the square back on the right edge of the canvas we will bring it back at a random y value.
            h.y = randint(0, canvas.height);
        // going off right
        } else if (h.x > canvas.width) {
            h.x = 0;
            h.y = randint(0, canvas.height);
        // going off top
        } else if (h.y + h.height < 0) {
            h.y = canvas.height;
            h.x = randint(0, canvas.width)
    
        // going off bottom
        } else if (h.y > canvas.height) {
            h.y = 0
            h.x = randint(0, canvas.width)
        }
        else {
            h.x = h.x + h.xChange;
            h.y = h.y + h.yChange;
        }
    
    }

    for (let l of levelUp) {
        // if the player collides with one of the level ups
        if (player_collides_levelUp(l)) {
            if(player.x < l.x) {
                player.xChange = player.xChange * 3
            } if (player.x > l.x) {
                player.xChange = player.xChange * 3
            } if (player.y < l.y) {
                player.yChange = player.yChange * 3
            } if (player.y > l.y){
                player.yChange = player.yChange * 3
            } else {
                player.xChange = player.xChange
                player.yChange = player.yChange
            }
        }
    }
    // Player going off the screen
    if (player.x + player.width < 0) {      // if your right hand corner is off the left hand edge..
        player.x = canvas.width;            // then I put you on the other side of the canvas
    } else if (player.x > canvas.width) {   // or else if your right hand corner has gone off the left hand edge then I put you on the right hand edge 
        player.x = -player.width;
    } 
    if (player.y > canvas.height) {         // if you go off the top we put you on the bottom and vice-versa
        player.y = -player.height;
    } else if (player.y + player.height < 0) {
        player.y = canvas.height;
    }

    //Handle key presses
    if (moveLeft) {                                 // if you pressed the left arrow this variable will have changed from false to true
        player.xChange = player.xChange - 0.5;      // moving left means we need to add a negative number to the x value - your xChange will get bigger each time which introduces acceleration   
        player.frameY = 3;
    }
    if (moveRight) {
        player.xChange = player.xChange + 0.5;      // moving right means we need to add a positive number to the x value 
        player.frameY = 2;
    }
    if (moveUp) {
        player.yChange = player.yChange - 0.5;      // moving up means we need to add a negative number to the y value 
        player.frameY = 1;
    }
    if (moveDown) {
        player.yChange = player.yChange + 0.5;      // moving down means we need to add a positive number to the y value
        player.frameY = 0;
    }

    // Update the players position
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;
    
    //Physics
    player.xChange = player.xChange * 0.7; // friction - if we have acceleration we need friction, otherwise the player will just get faster and faster
    player.yChange = player.yChange * 0.7; // friction - so the acceleration is speeding the player up and at the same time friction is slowing him down - giving smooth movement
    e.xChange = e.xChange * 0.7; 
    e.yChange = e.yChange * 0.7;
    h.xChange = h.xChange * 0.7; 
    h.yChange = h.yChange * 0.7;
}

// random number within a range function as in python
function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
//  If the player doesn't collide with the enemy return false otherwise return true
function player_collides_enemy(e) {
    if (player.x + player.width < e.x ||
        e.x + e.width < player.x ||
        player.y > e.y + e.height ||
        e.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function player_collides_castle(castle) {
    if (player.x + player.width < castle.x ||
        castle.x + castle.width < player.x ||
        player.y > castle.y + castle.height ||
        castle.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}function enemy_collides_castle(e) {
    if (e.x + e.width < castle.x ||
        castle.x + castle.width < e.x ||
        e.y > castle.y + castle.height ||
        castle.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_castle(h) {
    if (h.x + h.width < castle.x ||
        castle.x + castle.width < h.x ||
        h.y > castle.y + castle.height ||
        castle.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}
function player_collides_house(house) {
    if (player.x + player.width < house.x ||
        house.x + house.width < player.x ||
        player.y > house.y + house.height ||
        house.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}

function player_collides_wall_left(wall_left) {
    if (player.x + player.width < wall_left.x ||
        wall_left.x + wall_left.width < player.x ||
        player.y > wall_left.y + wall_left.height ||
        wall_left.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function enemy_collides_wall_left(e) {
    if (e.x + e.width < wall_left.x ||
        wall_left.x + wall_left.width < e.x ||
        e.y > wall_left.y + wall_left.height ||
        wall_left.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_wall_left(h) {
    if (h.x + h.width < wall_left.x ||
        wall_left.x + wall_left.width < h.x ||
        h.y > wall_left.y + wall_left.height ||
        wall_left.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}
function player_collides_wall_right(wall_right) {
    if (player.x + player.width < wall_right.x ||
        wall_right.x + wall_right.width < player.x ||
        player.y > wall_right.y + wall_right.height ||
        wall_right.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function enemy_collides_wall_right(e) {
    if (e.x + e.width < wall_right.x ||
        wall_right.x + wall_right.width < e.x ||
        e.y > wall_right.y + wall_right.height ||
        wall_right.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_wall_right(h) {
    if (h.x + h.width < wall_right.x ||
        wall_right.x + wall_right.width < h.x ||
        h.y > wall_right.y + wall_right.height ||
        wall_right.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}
function player_collides_wall_middle(wall_middle) {
    if (player.x + player.width < wall_middle.x ||
        wall_middle.x + wall_middle.width < player.x ||
        player.y > wall_middle.y + wall_middle.height ||
        wall_middle.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function enemy_collides_wall_middle(e) {
    if (e.x + e.width < wall_middle.x ||
        wall_middle.x + wall_middle.width < e.x ||
        e.y > wall_middle.y + wall_middle.height ||
        wall_middle.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_wall_middle(h) {
    if (h.x + h.width < wall_middle.x ||
        wall_middle.x + wall_middle.width < h.x ||
        h.y > wall_middle.y + wall_middle.height ||
        wall_middle.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}

function player_collides_rocks(rocks) {
    if (player.x + player.width < rocks.x ||
        rocks.x + rocks.width < player.x ||
        player.y > rocks.y + rocks.height ||
        rocks.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function enemy_collides_rocks(e) {
    if (e.x + e.width < rocks.x ||
        rocks.x + rocks.width < e.x ||
        e.y > rocks.y + rocks.height ||
        rocks.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_rocks(h) {
    if (h.x + h.width < rocks.x ||
        rocks.x + rocks.width < h.x ||
        h.y > rocks.y + rocks.height ||
        rocks.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}
function player_collides_hole(hole) {
    if (player.x + player.width < hole.x ||
        hole.x + hole.width < player.x ||
        player.y > hole.y + hole.height ||
        hole.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}
function enemy_collides_hole(e) {
    if (e.x + e.width < hole.x ||
        hole.x + hole.width < e.x ||
        e.y > hole.y + hole.height ||
        hole.y > e.y + e.height) {
        return false;
    } else {
        return true;
    }
}
function horse_collides_hole(h) {
    if (h.x + h.width < hole.x ||
        hole.x + hole.width < h.x ||
        h.y > hole.y + hole.height ||
        hole.y > h.y + h.height) {
        return false;
    } else {
        return true;
    }
}

function player_collides_horse(h) {
    if (player.x + player.width < h.x ||
        h.x + h.width < player.x ||
        player.y > h.y + h.height ||
        h.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}

function player_collides_levelUp(l) {
    if (player.x + player.width < l.x ||
        l.x + l.width < player.x ||
        player.y > l.y + l.height ||
        l.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}

// the key that will be pressed by the user will be stored in the event object
function activate(event) {
    let key = event.key;            // put the variable key equal to the value for the property key in the object event
    if (key === "ArrowLeft") {      // if key is equal to the ArrowLeft key we put moveLeft = true
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    } //else if (key === "Space") {
    //     shootPressed = true;
    // }
       
}

// This is very similar to activate function - when the user releases a key it sets the variables back to false
function deactivate(event) {
    // we find out which key the user has released
    let key = event.key;            
    if (key === "ArrowLeft") {      
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    } //else if (key === "Space") {
    //     shootPressed = false;
    // }
}
    
function stop(outcome) {
    // once they game is over we need to stop listening and reacting to you pressing things on the keyboard
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    // then we cancel the animation called request_id - we saved our animation in a variable called request_id
    window.cancelAnimationFrame(request_id);
    let score_element = document.querySelector("#outcome");
    score_element.innerHTML = outcome;

    let data = new FormData();
    data.append("score", score);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/store_score", true);
    xhttp.send(data);
}

// tries to fix the problem of the page trying to draw the canvas before the images have been fully loaded
// Once we put in this function we need to go to the top and delete the playerImage and backgroundImage variables that we just created
// We also need to delete where we loaded these image files into our init function 
// Instead of these, at the top we need to create a new variable called IMAGES which is an object and has properties player and background, who's values are the image files.
// We also then have to change the line where we call our draw() function in our init() function and instead say load_images(draw)
function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images -1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
    }
}
function handle_response() {
    //Check the response has fully arrived
    if( xhttp.readyState === 4 ) {
        // Check the request was successful
        if ( xhttp.status === 200) {
            if( xhttp.responseText === "success") {
                // score was successfully stored in database
            } else {

            }
        }
    }
}