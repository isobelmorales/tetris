//// DOM ELEMENTS ////

// pages
const landingPage = document.getElementById('landing-page')
const instructionsPage = document.getElementById('instructions-page')
const controlsPage = document.getElementById('controls-page')
const gamePage = document.getElementById('game-page')

// buttons
const playButton = document.getElementById('play')
const arrow1 = document.getElementById('arrow-1')
const arrow2 = document.getElementById('arrow-2')
const pause = document.getElementById('pause')
const reset = document.getElementById('reset')

// displays
const scoreDisplay = document.getElementById('score')
const levelDisplay = document.getElementById('level')
const linesDisplay = document.getElementById('lines')
const highscoreDisplay = document.getElementById('highscore')

// canvas elements
const canvas = document.getElementById('canvas')
const tileAtlas = document.getElementById('tile-atlas')


//// CANVAS SET UP ////

const ctx = canvas.getContext('2d')

canvas.width = 300
canvas.height = 600

ctx.scale(30,30)

//// OBJECTS ////

const player = {
    position: {
        x: 0,
        y: 0
    },
    array: null,
    score: 0,
    level: 1,
    lines: 0,
    highscore: 0
}

const game = {
    pieces: ['z', 's', 'o', 'l', 't', 'i', 'j'],
    array: null,
    status: false,
    interval: null,
    pause: false
}

game.array = [...Array(20)].map(e => Array(10).fill(0))

//// DETERMINE TETROMINO SHAPES ////

const tetrominoShape = (piece) => {
    switch (piece) {
        case 'z': 
            return [
                [1,1,0],
                [0,1,1],
                [0,0,0]
            ]
        case 's':
            return [
                [0,2,2],
                [2,2,0],
                [0,0,0]
            ]
        case 'o':
            return [
                [3, 3],
                [3, 3]
            ]
        case 'l':
            return [
                [0,4,0],
                [0,4,0],
                [0,4,4]
            ]
        case 't':
            return [
                [0,0,0],
                [5,5,5],
                [0,5,0]
            ]
        case 'i':
            return [
                [0,6,0,0],
                [0,6,0,0],
                [0,6,0,0],
                [0,6,0,0]
            ]
        case 'j':
            return [
                [0,7,0],
                [0,7,0],
                [7,7,0]
            ]
    }
}

//// CALCULATE POINTS + UPDATE SCORE ////

const points = () => {
    let rowCount = 1
    let array = game.array
    count:for(let y = array.length - 1; y > 0; --y) {
        for(let x = 0; x < array[y].length; ++x) {
            if(array[y][x] === 0) {
                continue count
            }
        }
        const row = array.splice(y, 1)[0].fill(0)
        array.unshift(row)
        ++y
        player.score += (rowCount * 100)
        rowCount *= 2
    }
}

const updateScore = () => {
    scoreDisplay.innerText = player.score
    if(player.score > player.highscore) {
        player.highscore = player.score
        highscoreDisplay.innerText = player.score
    }
    player.lines = player.score/100
    linesDisplay.innerText = player.lines
    if(player.lines > 0){
        player.level = ((player.lines - (player.lines%5))/5)+1
    }
    levelDisplay.innerText = player.level
}

//// CHECK FOR COLLISION ////

const collide = (game, player) => {
    let m = player.array
    let o = player.position
    let area = game.array

    for(let y = 0; y < m.length; ++y) {
        for(let x = 0; x < m[y].length; ++x) {
            if(m[y][x]!==0&&(area[y+o.y]&&area[y+o.y][x+o.x])!==0) {
                return true;
            }
        }
    }
    return false
}

//// RENDER TILEMAPS ////

const render = (array, position) => {
    let tsize = 31
    let c = position.x
    let r = position.y
    array.forEach((row, y) => {
        row.forEach((value, x) => {
            // if(value !== 0){
            //     ctx.drawImage(tileAtlas, value * tsize, 0, tsize, tsize, x + c, y + r, 1, 1)
            // }
            ctx.drawImage(tileAtlas, value * tsize, 0, tsize, tsize, x + c, y + r, 1, 1)
        })
    })
}

//// MERGE GAME + PLAYER ARRAYS ////

const merge = (game, player) => {
    player.array.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                game.array[y + player.position.y][x + player.position.x] = value
            }
        })
    })
}

//// MOVEMENT HANDLING ////

// drop
const drop = () => {
    player.position.y++
    if(collide(game, player)) {
        player.position.y--
        merge(game, player)
        points()
        resetGame()
        updateScore()
    }
}

const canMoveDown = () => {
    if(collide(game, player)) {
        return false
    }
    return true
}

const hardDrop = () => {
    while(canMoveDown()) {
        player.position.y++
    }
    if(collide(game, player)) {
        player.position.y--
        merge(game, player)
        points()
        resetGame()
        updateScore()
    }
}

// rotate
const rotateArray = (matrix, value) => {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ]
        }
    }
    if(value > 0) {
        matrix.forEach(row => row.reverse())
    } else {
        matrix.reverse()
    }
}

const rotate = (value) => {
    const position = player.position.x
    let translation = 1
    rotateArray(player.array, value)
    while(collide(game, player)) {
        player.position.x += translation
        translation =- (translation + (translation > 0 ? 1 : -1))
        if(traslation > player.array[0].length) {
            rotateArray(player.array, -value)
            player.position.x = position
            return
        }
    }
}

// move
const move = (value) => {
    player.position.x += value
    if(collide(game, player)) {
        player.position.x -= value
    }
}

//// CLEAR COMPLETED ROWS ////

//// GAME LOOP ////

// redrawing the canvas 
const drawGameBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#545454"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    updateScore()
    render(game.array, {x: 0, y: 0})
    render(player.array, player.position)
}

// game loop
let dropInter = 100
let time = 0
const gameLoop = () => {
    time++
    if(time >= dropInter) {
        drop()
        time = 0
    }
    drawGameBoard()
    // console.log(player)
    // console.log(game)
}

// stop loop
const stopGameLoop = () => { 
    clearInterval(game.interval)
    game.interval = null
}

//// RESET GAME ////

const resetGame = () => {
    player.array = tetrominoShape(game.pieces[Math.floor(Math.random() * game.pieces.length)])
    player.position.y = 0
    player.position.x = 3
    if(collide(game, player)) {
        game.array.forEach(row => row.fill(0))
        player.score = 0
        game.status = false
    }
}

//// GAME OVER ////

const gameOver = () => {
    stopGameLoop()
    ctx.font = "1px 'Press Start 2P'"
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GAME OVER', (canvas.width/30)/2, (canvas.height/30)/2)
}

// resetGame()
// drawGameBoard()
// gameOver()

//// TOGGLE DOM CLASSES ////

const toggleHide = (page1, page2) => {
    let currentPage = page1
    let nextPage = page2
    currentPage.classList.toggle('hide')
    nextPage.classList.toggle('hide')
}

//// EVENT LISTENERS ////

// key events
document.addEventListener('keydown', (e) => {
    let key = e.keyCode
    // up arrow - rotate right
    if(key === 38) {
        rotate(+1)
    // z - rotate left
    } else if(key === 90) {
        rotate(-1)
    // spacebar - hard drop
    } else if(key === 32) {
        hardDrop()
    // down - drop
    } else if(key === 40) {
        drop()
    // left
    } else if(key === 37) {
        move(-1)
    // right
    } else if(key === 39) {
        move(+1)
    }
})

// move from landing to instructions when 'click to play' is clicked
playButton.addEventListener('click', () => {
    toggleHide(landingPage, instructionsPage)
})

// move from instructions to controls when arrow is clicked
arrow1.addEventListener('click', () => {
    toggleHide(instructionsPage, controlsPage)
})

// move from controls to game when arrow is clicked
arrow2.addEventListener('click', () => {
    toggleHide(controlsPage, gamePage)
    game.status = true
    resetGame()
    game.interval = setInterval(() => {
        if(game.status) {
            gameLoop()
        } else {
            gameOver()
        }
    }, 10)
})

// pauses game when pause button is clicked
pause.addEventListener('click', () => {
    if(game.pause) {
        game.pause = false
        game.interval = setInterval(() => {
            if(game.status) {
                gameLoop()
            } else {
                gameOver()
            }
        }, 10)
        pause.innerText = 'PAUSE'
    } else {
        game.pause = true
        stopGameLoop()
        pause.innerText = 'RESUME'
    }
})
// # gameStatus === 'playing' ? stop game loop, change inner text to resume show a pop up over screen to say paused

// # gameStatus === 'pause' ? resume game loop, change inner text to pause hide pop up over screen

// resets game when restart button is clicked
reset.addEventListener('click', () => {
    stopGameLoop()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.array = [...Array(20)].map(e => Array(10).fill(0))
    player.array = null
    player.level = 1
    levelDisplay.innerText = player.level
    player.lines = 0
    game.status = true
    resetGame()
    game.interval = setInterval(() => {
        if(game.status) {
            gameLoop()
        } else {
            gameOver()
        }
    }, 10)
})

