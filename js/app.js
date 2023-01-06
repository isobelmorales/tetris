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
const pauseButton = document.getElementById('pause')
const restartButton = document.getElementById('restart')

// displays
const scoreDisplay = document.getElementById('score')
const levelDisplay = document.getElementById('level')
const linesDisplay = document.getElementById('lines')
const highscoreDisplay = document.getElementById('highscore')
const gameoverDisplay = document.getElementById('game-over')

//// CANVAS ////

// setting context
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

//// VARIABLES ////

// data variables
let score = 0
let level = 1
let lines = 0
let highscore = 0
let gameStatus = 'playing'
let currentBlock = null


// setting game board
const squaresAcross = 12
const squaresDown = 20
const startX = 4
const startY = 0

// game pieces
const zBlock = [[0,0], [1,0], [1,1], [2,1]]
const sBlock = [[1,0], [2,0], [0,1], [1,1]]
const oBlock = [[0,0], [1,0], [0,1], [1,1]]
const lBlock = [[2,0], [0,1], [1,1], [2,1]]
const tBlock = [[1,0], [0,1], [1,1], [2,1]]
const iBlock = [[0,0], [1,0], [2,0], [3,0]]
const rBlock = [[0,0], [0,1], [1,1], [2,1]]
const gamePieces = [zBlock, sBlock, oBlock, lBlock, tBlock, iBlock, rBlock]

//// DEFINING BOARD GRID ////
// array for square coordinates that consists of 20 items, each items is an array with 12 items
const boardCoordinates = [...Array(squaresDown)].map(e => Array(squaresAcross).fill(0))

// coordinates class
class blockCoordinates {
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

// create coordinate map for blocks
const createCoordinateMap = () => {
    let i = 0
    let j = 0
    for(let y = 9; y <= 446; y += 23) {
        for(let x = 11; x <= 264; x += 23) {
            boardCoordinates[i][j] = new blockCoordinates(x,y)
            i++
        }
        j++
        i = 0
    }
}

//// GAME FUNCTIONS ////

// setting game canvas
const setupCanvas = () => {
    canvas.width = 936
    canvas.height = 956

    ctx.scale(2,2)

    ctx.fillStyle = '#545454'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// pause game

// reset game 
const resetGame = () => {
    score = 0
    level = 1
    lines = 0
    gameStatus = 'playing'
}

//// EVENT LISTENERS ////

playButton.addEventListener('click', () => {
    landingPage.classList.toggle('hide')
    instructionsPage.classList.toggle('hide')
})

arrow1.addEventListener('click', () => {
    instructionsPage.classList.toggle('hide')
    controlsPage.classList.toggle('hide')
})

arrow2.addEventListener('click', () => {
    controlsPage.classList.toggle('hide')
    gamePage.classList.toggle('hide')
    setupCanvas()
})

//# pauseButton.addEventListener('click', )

restartButton.addEventListener('click', resetGame)