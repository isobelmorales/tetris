// pages
const landingPage = document.getElementById('landing-page')
const instructionsPage = document.getElementById('instructions-page')
const controlsPage = document.getElementById('controls-page')
const gamePage = document.getElementById('game-page')

// buttons
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

// setting canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// data variables
let score = 0
let level = 1
let lines = 0
let highscore = 0
let status = 'playing'

// setting game board
const boardWidth = 12
const boardHeight = 20
const startX = 4
const startY = 0

// arrays

// pause game

// reset game 

// event listeners