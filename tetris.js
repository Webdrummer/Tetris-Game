const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');


// scales up the tetris block
context.scale(20, 20);

// clear the lines
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        y++;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
 }

// returns true if a block collides in the arena with a value of 1 or nothing (the ground)
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// create a Matrix which consists of a certain amount of rows (h) and columns (h) and fill it with values of 0;
function createMatrix(w, h) {
    const matrix = [];
    // h-- is true until it´s negative
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// create the blocks
function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],            
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

// iterates over the tetris block matrix and draws the block
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// merge copies the block in the arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    // prevents the player to move the block outside of the canvas
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    level.innerText = "Level 1";

    // Game Over
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
        dropInterval = 1000;
        level.innerText = "GAME OVER";
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    // prevents the block from moving outside the canvas when rotating
    while(collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}


// rotate the block -> first change the rows of the matrix to columns and then reverse the values
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;

let dropInterval = 1000;

let level = document.getElementById('level');

// the game will be faster every 3 minutes
setInterval(function() {dropInterval -= 100; 
                      
                        if (dropInterval === 1000) {
                                level.innerText = "Level 1";
                                }
                        else if (dropInterval === 900) {
                                level.innerText = "Level 2";
                                }
                        else if (dropInterval === 800) {
                                level.innerText = "Level 3";
                                 }   
                        else if (dropInterval === 700) {
                                level.innerText = "Level 4";
                                }
                        else if (dropInterval === 600) {
                                level.innerText = "Level 5";
                                }   
                        else if (dropInterval === 500) {
                                level.innerText = "Level 6";
                                }
                        else if (dropInterval === 400) {
                                level.innerText = "Level 7";
                                }
                        else if (dropInterval === 300) {
                                level.innerText = "Level 8";
                                }
                        else if (dropInterval === 200) {
                                level.innerText = "Level 9";
                                }
                        if (dropInterval <= 100) {
                                dropInterval = 100;
                                level.innerText = "Level 10";
                            }
                        }, 180000);

let lastTime = 0;

function update(time = 0) {
    // deltaTime is the time between each new frame
    const deltaTime = time - lastTime;
    lastTime = time;
    // dropCounter counts the time of the frames
    dropCounter += deltaTime;
    // if the time is bigger than 1s, the player y-pos is incremented by 1
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

// display Score
function updateScore() {
    document.getElementById('score').innerHTML = `Score: ${player.score}`;
}

// give the blocks colors
const colors = [
    null,
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink',
]

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', e => {
    console.log(e);
    if (e.keyCode === 37) {
        playerMove(-1);
    } else if (e.keyCode === 39) {
        playerMove(+1);
    } else if (e.keyCode === 40) {
        playerDrop();
    } else if (e.keyCode === 81) {
        playerRotate(-1);
    } else if (e.keyCode === 87) {
        playerRotate(1);
    }
})

playerReset();
updateScore();
update();

