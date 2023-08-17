const W = 700
const H = 700
const N = 150
const INIT_MAX_V = 0.2
const BACKGROUND = 250
const GRID_W = 50

let screenPos
let pressed
let mouseClickPos

let t
let pause 
let history 
let birds1 
let birds2 

let readBirds
let writeBirds

function setup() {
  createCanvas(W, H)
  randomSeed(99) 
  t = 0
  pause = false
history = []
birds1 = []
birds2 = []
  debug=[]

  pressed = false
  screenPos = createVector(0, 0)
  mouseClickPos = createVector(0,0)
  
  for (let i = 0; i < N; i++) {
    let k = 1/2
    let pos = createVector(
      random((-k * W) / 3, (k * W) / 3),
      random((-k * H) / 3, (k * H) / 3),
      random((-k * H) / 3, (k * H) / 3)
    )
    let v = createVector(random(-1,1), random(-1,1), random(-1,1)).setMag(INIT_MAX_V)
    birds1.push(new Bird(pos, v))
    birds2.push(new Bird(pos, v))
  }
  readBirds = birds1
  writeBirds = birds2
  updateHistory(readBirds)
}

function update() {
  if(pressed){
    let dif =p5.Vector.sub(createVector(mouseX, mouseY), mouseClickPos).div(10)
    screenPos.add(dif)
  }
  
  if(t==69){
    // pause = true
  }
  
  if(!pause){
   step()
  }
}

function step(){
   debug = []
  for (let i = 0; i < readBirds.length; i++) {
    let readB = readBirds[i]
    let writeB = writeBirds[i]
    updateBird(readB, writeB, readBirds)
  }
  
  swapBirdBuffers()  
  t++
  updateHistory(readBirds)
}

function swapBirdBuffers(){
  if(readBirds == birds1){
    writeBirds = birds1
    readBirds = birds2
  }else{
    readBirds = birds1
    writeBirds = birds2
  }
}

function draw() {
  background(BACKGROUND)
  update()
  drawGrid()
  for(let i = 0; i< debug.length;i++){
    debug[i]()
  }
  for (let i = 0; i < readBirds.length; i++) {
    let b = readBirds[i]
    drawBird(b)
  }
  drawHistory()
  if(pressed){
    noStroke()
    fill(255, 0,0,80)
    circle(mouseX, mouseY, 15)
    circle(mouseClickPos.x, mouseClickPos.y, 15)
  }
  textSize(20)
  fill('black')
  noStroke()
  text(t, 20,20)
}

function drawGrid(){
  let leftTop = toWorldPos(createVector(-W/2,-H/2))
  let leftOffset = (GRID_W - leftTop.x) % GRID_W
  let topOffset = (GRID_W - leftTop.y) % GRID_W
  stroke(150)
  drawingContext.setLineDash([])
  for(let i = leftOffset; i< W; i+=GRID_W){
    line(i, 0, i, H);    
  }
  for(let i = topOffset; i< H; i+=GRID_W){
    line(0, i, W, i);    
  }
}

function toScreenPos(worldPos) {
  let result = p5.Vector.sub(worldPos, screenPos)
  result.add(createVector(W / 2, H / 2))
  return result
}

function toWorldPos(sPos) {
  let result = p5.Vector.add(sPos, screenPos)
  result.sub(createVector(W / 2, H / 2))
  return result
}

function mousePressed() {
  pressed = !pressed
  mouseClickPos = createVector(mouseX, mouseY)
}

function keyPressed(){
  if(keyCode == 32){
    pause = !pause
  }
  if(keyCode == RIGHT_ARROW){
    step()
  }
  if(keyCode == BACKSPACE){
    setup()
  }
}

