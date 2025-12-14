let canvasWidth = 1200
let canvasHeight = 550
let context
// karim
let karimWidth = isMobile ? 20 : 150
let karimHeight = 150
let karimY = canvasHeight - karimHeight
let karimX = 50
let karimImg

let karim = {
	x: karimX,
	y: karimY,
	width: karimWidth,
	height: karimHeight,
}

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)



// cactus
let cactusArray = []
let cactus1Width = 34
let cactus2Width = 34
let cactus3Width = 70

let cactusHeight = 70
let cactusX = 1200
let cactusY = canvasHeight - cactusHeight

let cactus1Img
let cactus2Img

let velocityX = -9 // cactus moving speed
let velocityY = 0
let gravity = isMobile ? 0.4 : 0.3

let gameOver = false
let score = 0
let restartButton
let audio
window.onload = function () {
	let canvas = document.getElementById("canvas")
	restartButton = document.getElementById("restart")
	canvas.height = canvasHeight
	canvas.width = canvasWidth
	canvas.style.borderBottom = "1px solid black"
	canvas.style.backgroundImage = "./img/bg.jpg"
	canvas.style.backgroundRepeat = "no-repeat"
	canvas.style.backgroundSize = "cover"
	context = canvas.getContext("2d")
	audio = new Audio("./zabit.mp3")
	// draw initial karim

	karimImg = new Image()
	karimImg.src = "./img/karim.png"
	karimImg.onload = function () {
		context.drawImage(karimImg, karim.x, karim.y, karim.width, karim.height)
	}
	cactus1Img = new Image()
	cactus1Img.src = "./img/zabit-1.jpg"
	cactus2Img = new Image()
	cactus2Img.src = "./img/zabit-2.jpg"
	cactus3Img = new Image()
	cactus3Img.src = "./img/zabit-3.jpg"

	requestAnimationFrame(update)
	setInterval(placeCactus, 1000)
	document.addEventListener("keydown", moveKarim)
	document.addEventListener("touchstart", moveKarim)
}

function update() {
	requestAnimationFrame(update)
	if (gameOver) {
		restartButton.style.display = "flex"
		restartButton.addEventListener("click", restart)
		return
	}
	if (!gameOver) {
		restartButton.style.display = "none"
	}
	context.clearRect(0, 0, canvasWidth, canvasHeight)

	// karim
	velocityY += gravity
	karim.y = Math.min(karim.y + velocityY, karimY)
	context.drawImage(karimImg, karim.x, karim.y, karim.width, karim.height)

	for (let i = 0; i < cactusArray.length; i++) {
		let cactus = cactusArray[i]
		cactus.x += velocityX
		context.drawImage(
			cactus.img,
			cactus.x,
			cactus.y,
			cactus.width,
			cactus.height
		)
		if (detectedCollision(karim, cactus)) {
			gameOver = true
			karimImg.src = "./img/over-img.jpg"
			karimImg.onload = function () {
				context.drawImage(karimImg, karim.x, karim.y, karim.width, karim.height)
			}
		}
	}

	// score
	context.fillStyle = "black"
	context.font = "20px courier"
	score++
	context.fillText(score, 5, 20)
}

function moveKarim(e) {
	if (gameOver) return
	if (e.type === "touchstart") {
		e.preventDefault()
		if (karim.y === karimY) {
			audio.play()
			velocityY = -10
		}
		return
	}
	if ((e.code == "Space" || e.code == "ArrowUp") && karim.y == karimY) {
		// jump
		audio.play()
		velocityY = -10
	} else if ((e.code == "KeyS" || e.code == "ArrowDown") && karim.y == karimY) {
		if (karim.height == 150) {
			karim.height = 50
			karimY = 500
		} else {
			karim.height = 150
			karimY = canvasHeight - karim.height
		}
	}
}

function placeCactus() {
	if (gameOver) return
	let cactus = {
		img: null,
		x: cactusX,
		y: cactusY,
		width: null,
		height: cactusHeight,
	}
	let placeCactusChance = Math.random()
	if (placeCactusChance < 0.33) {
		cactus.img = cactus1Img
		cactus.width = cactus1Width
		cactusArray.push(cactus)
	} else if (placeCactusChance < 0.66) {
		cactus.img = cactus2Img
		cactus.width = cactus2Width
		cactusArray.push(cactus)
	} else if (placeCactusChance > 0.66) {
		cactus.img = cactus3Img
		cactus.width = cactus3Width
		cactusArray.push(cactus)
	}
	if (cactusArray.length > 5) {
		cactusArray.shift()
	}
}

function detectedCollision(a, b) {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	)
}

function restart() {
	context.clearRect(0, 0, canvasWidth, canvasHeight)
	cactusArray = []
	karimImg.src = "./img/karim.png"
	gameOver = false
	score = 0
}
